import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import ParticleBackground from '../Components/ParticleBackground';
import { pathTypeLabels } from '../Data/alumniDemoData';
import {
    getAlumniPrimaryOrg,
    getAlumniProfileLine,
    getAlumniProfileTypeLabel,
    getCompactAlumniName,
    getPrimaryAlumniJob
} from '../Data/alumniDisplay';
import { getAlumniPhoto } from '../Data/alumniPhotoRegistry';
import {
    ALUMNI_SESSION_EVENT,
    fetchAlumniProfiles,
    getStoredAlumniSession,
    isAlumniAdmin
} from '../Services/alumniApi';
import {
    deletePortalItem,
    fetchPortalContent,
    savePortalItem,
    toggleFeedCommentLike,
    toggleFeedLike
} from '../Services/alumniPortalApi';
import '../Styling/AlumniDirectory.css';
import '../Styling/EditorialPages.css';

const statusLabels = {
    all: 'All members',
    current: 'Current',
    alumni: 'Alumni'
};

const defaultFilters = {
    query: '',
    status: 'all',
    pathType: 'all',
    classYear: 'all',
    willingOnly: false
};

const defaultPortalContentState = {
    feedPosts: [],
    feedComments: [],
    feedLikes: [],
    feedCommentLikes: [],
    announcements: [],
    tasks: [],
    calendarEvents: []
};

const NOTIFICATION_SEEN_KEY_PREFIX = 'ujlp_alumni_notifications_seen_at';
const NOTIFICATION_DISMISSED_KEY_PREFIX = 'ujlp_alumni_notifications_dismissed';
const NOTIFICATIONS_SEEN_EVENT = 'ujlp-alumni-notifications-seen-change';

const normalizeText = (value) => String(value || '').toLowerCase();

const formatUpdatedDate = (value) => {
    if (!value) return 'Not saved yet';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Not saved yet';
    return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

const getProfileName = (profile) => profile?.fullName || 'Unnamed member';

const getPathLabel = (profile) => pathTypeLabels[profile?.pathType] || 'Other';

const portalTabs = [
    ['home', 'Home', 'M6 10.5 12 5l6 5.5v7.5a1 1 0 0 1-1 1h-3.5v-5h-3v5H7a1 1 0 0 1-1-1v-7.5Z'],
    ['feed', 'Feed', 'M5 6h14M5 12h14M5 18h9'],
    ['calendar', 'Calendar', 'M7 3v3M17 3v3M4 8h16M6 5h12a2 2 0 0 1 2 2v12H4V7a2 2 0 0 1 2-2ZM8 12h3M13 12h3M8 16h3M13 16h3'],
    ['directory', 'Directory', 'M8 7a3 3 0 1 0 0 .1M4 19a4 4 0 0 1 8 0M17 8a2.5 2.5 0 1 0 0 .1M14 19a3.5 3.5 0 0 1 6 0'],
    ['resources', 'Resources', 'M6 5h12v14H6zM9 8h6M9 12h6M9 16h4'],
    ['tasks', 'Weekly Tasks', 'M7 7h10M7 12h10M7 17h6M4 7l1 1 2-2M4 12l1 1 2-2M4 17l1 1 2-2'],
    ['notifications', 'Notifications', 'M18 16v-5a6 6 0 0 0-12 0v5l-2 2h16zM10 20h4']
];

const Icon = ({ path }) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d={path} />
    </svg>
);

const formatShortDate = (value) => {
    if (!value) return 'Date pending';
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

const parseCalendarDate = (value) => {
    if (!value) return null;
    const [year, month, day] = value.split('-').map(Number);
    if (!year || !month || !day) return null;
    const date = new Date(year, month - 1, day);
    if (Number.isNaN(date.getTime())) return null;
    date.setHours(0, 0, 0, 0);
    return date;
};

const toCalendarDateValue = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const addCalendarDays = (date, days) => {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + days);
    return nextDate;
};

const getCalendarWeekStart = (date) => {
    const weekStart = new Date(date);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    return weekStart;
};

const getDefaultCalendarWeekStart = (events) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const datedEvents = events
        .map(eventItem => parseCalendarDate(eventItem.eventDate))
        .filter(Boolean)
        .sort((left, right) => left - right);
    const upcomingDate = datedEvents.find(date => date >= today);
    return toCalendarDateValue(getCalendarWeekStart(upcomingDate || datedEvents[0] || today));
};

const formatWeekRange = (days) => {
    if (!days.length) return 'Week';
    const start = days[0].date;
    const end = days[days.length - 1].date;
    const sameMonth = start.getMonth() === end.getMonth();
    const sameYear = start.getFullYear() === end.getFullYear();
    const startLabel = start.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        ...(sameYear ? {} : { year: 'numeric' })
    });
    const endLabel = end.toLocaleDateString(undefined, {
        ...(sameMonth ? {} : { month: 'short' }),
        day: 'numeric',
        year: 'numeric'
    });
    return `${startLabel} - ${endLabel}`;
};

const formatCalendarTime = (startTime, endTime) => {
    const formatOne = (value) => {
        if (!value) return '';
        const [hours, minutes] = value.split(':');
        const hourNumber = Number(hours);
        if (Number.isNaN(hourNumber)) return value;
        const suffix = hourNumber >= 12 ? 'PM' : 'AM';
        const hour = hourNumber % 12 || 12;
        return `${hour}:${minutes || '00'} ${suffix}`;
    };
    const start = formatOne(startTime);
    const end = formatOne(endTime);
    if (start && end) return `${start} - ${end}`;
    return start || end || 'Time pending';
};

const toTags = (value) => value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);

const getMentionHandle = (profile) => getProfileName(profile)
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .join('')
    .toLowerCase();

const getMentionHandlesFromText = (value) => Array.from(
    new Set(
        String(value || '')
            .match(/@[a-zA-Z0-9._-]+/g)
            ?.map(handle => handle.slice(1).replace(/[^a-zA-Z0-9]/g, '').toLowerCase())
            .filter(Boolean) || []
    )
);

const getNotificationSeenKey = (userId) => `${NOTIFICATION_SEEN_KEY_PREFIX}:${userId || 'guest'}`;
const getNotificationDismissedKey = (userId) => `${NOTIFICATION_DISMISSED_KEY_PREFIX}:${userId || 'guest'}`;

const readDismissedNotificationIds = (userId) => {
    try {
        const value = window.localStorage.getItem(getNotificationDismissedKey(userId));
        const parsed = JSON.parse(value || '[]');
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const writeDismissedNotificationIds = (userId, ids) => {
    window.localStorage.setItem(getNotificationDismissedKey(userId), JSON.stringify(Array.from(new Set(ids))));
};

const dispatchNotificationsChanged = () => {
    window.dispatchEvent(new Event(NOTIFICATIONS_SEEN_EVENT));
};

const normalizeNotificationTime = (value) => {
    if (!value) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return `${value}T00:00:00.000Z`;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? String(value) : date.toISOString();
};

const defaultFeedMentionMenu = {
    open: false,
    query: '',
    startIndex: 0,
    endIndex: 0,
    activeIndex: 0
};

const getActiveFeedMention = (value, cursorIndex) => {
    const textBeforeCursor = String(value || '').slice(0, cursorIndex);
    const match = textBeforeCursor.match(/(^|\s)@([a-zA-Z0-9._-]*)$/);
    if (!match) return null;

    return {
        query: match[2],
        startIndex: cursorIndex - match[2].length - 1,
        endIndex: cursorIndex
    };
};

const defaultFeedDraft = {
    id: '',
    title: '',
    body: '',
    category: 'Network',
    postType: 'update',
    eventDate: '',
    deadlineDate: '',
    tagsText: '',
    pinned: false,
    authorUserId: '',
    authorName: '',
    authorPhotoKey: ''
};

const defaultCalendarDraft = {
    id: '',
    title: '',
    details: '',
    category: 'Event',
    eventDate: '',
    startTime: '',
    endTime: '',
    location: '',
    linkUrl: '',
    pinned: false
};

const createDefaultCalendarDraft = () => ({ ...defaultCalendarDraft });

function AlumniDirectory() {
    const location = useLocation();
    const navigate = useNavigate();
    const [session, setSession] = useState(() => getStoredAlumniSession());
    const [authMessage, setAuthMessage] = useState('');
    const [profiles, setProfiles] = useState([]);
    const [filters, setFilters] = useState(defaultFilters);
    const [activeView, setActiveView] = useState('home');
    const [editingProfileUserId, setEditingProfileUserId] = useState(null);
    const [portalContent, setPortalContent] = useState(defaultPortalContentState);
    const [feedDraft, setFeedDraft] = useState(defaultFeedDraft);
    const [feedMessage, setFeedMessage] = useState('');
    const [isFeedComposerOpen, setIsFeedComposerOpen] = useState(false);
    const [feedMentionMenu, setFeedMentionMenu] = useState(defaultFeedMentionMenu);
    const [commentDrafts, setCommentDrafts] = useState({});
    const [expandedLikePostId, setExpandedLikePostId] = useState('');
    const [notificationsSeenAt, setNotificationsSeenAt] = useState('');
    const [dismissedNotificationIds, setDismissedNotificationIds] = useState([]);
    const [calendarDraft, setCalendarDraft] = useState(createDefaultCalendarDraft);
    const [calendarMessage, setCalendarMessage] = useState('');
    const [calendarWeekStart, setCalendarWeekStart] = useState('');
    const [selectedCalendarEventId, setSelectedCalendarEventId] = useState('');
    const [editorType, setEditorType] = useState('announcements');
    const [editorMessage, setEditorMessage] = useState('');
    const [editorDraft, setEditorDraft] = useState({
        title: '',
        body: '',
        category: 'Update',
        postType: 'update',
        eventDate: '',
        deadlineDate: '',
        publishDate: '',
        role: 'Writers',
        dueDate: '',
        priority: 'medium',
        tagsText: '',
        pinned: false
    });
    const [loading, setLoading] = useState(false);
    const feedPostTextareaRef = useRef(null);

    const isAdmin = isAlumniAdmin(session);
    const currentUserId = session?.user?.id || '';

    useEffect(() => {
        const syncSession = () => setSession(getStoredAlumniSession());
        window.addEventListener(ALUMNI_SESSION_EVENT, syncSession);
        window.addEventListener('storage', syncSession);
        window.addEventListener('focus', syncSession);
        return () => {
            window.removeEventListener(ALUMNI_SESSION_EVENT, syncSession);
            window.removeEventListener('storage', syncSession);
            window.removeEventListener('focus', syncSession);
        };
    }, []);

    const loadProfiles = async (activeSession = session) => {
        if (!activeSession) return;
        setLoading(true);
        setAuthMessage('');
        try {
            const rows = await fetchAlumniProfiles(activeSession);
            setProfiles(rows);
        } catch (error) {
            setAuthMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session) {
            loadProfiles(session);
            fetchPortalContent(session).then(content => setPortalContent({ ...defaultPortalContentState, ...content }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session?.user?.id]);

    useEffect(() => {
        if (!currentUserId) {
            setNotificationsSeenAt('');
            return;
        }

        setNotificationsSeenAt(window.localStorage.getItem(getNotificationSeenKey(currentUserId)) || '');
        setDismissedNotificationIds(readDismissedNotificationIds(currentUserId));
    }, [currentUserId]);

    const ownProfile = useMemo(() => {
        if (!session?.user?.id) return null;
        return profiles.find(profile => profile.userId === session.user.id) || null;
    }, [profiles, session]);

    const activeProfile = useMemo(() => {
        if (!session?.user?.id) return null;
        const targetUserId = editingProfileUserId || session.user.id;
        if (targetUserId === session.user.id) return ownProfile;
        return profiles.find(profile => profile.userId === targetUserId) || null;
    }, [editingProfileUserId, ownProfile, profiles, session]);

    const accountName = getCompactAlumniName(ownProfile, session?.user);

    const classYears = useMemo(() => {
        const values = profiles
            .map(profile => profile.classYear)
            .filter(Boolean)
            .sort((left, right) => right.localeCompare(left));
        return ['all', ...Array.from(new Set(values))];
    }, [profiles]);

    const filteredProfiles = useMemo(() => {
        const query = normalizeText(filters.query);
        return profiles.filter(profile => {
            const searchable = [
                profile.fullName,
                profile.ujlpRole,
                profile.currentTitle,
                profile.currentOrg,
                profile.location,
                profile.industry,
                profile.lawSchool,
                profile.gradSchool,
                profile.undergraduateSchool,
                profile.undergradMajor,
                profile.degreeTitle,
                profile.email,
                profile.profileType,
                ...(profile.jobs || []).flatMap(job => [job.employer, job.industry, job.title, job.sector]),
                ...(profile.interests || [])
            ].map(normalizeText).join(' ');

            const matchesQuery = !query || searchable.includes(query);
            const matchesStatus = filters.status === 'all' || profile.status === filters.status;
            const matchesPath = filters.pathType === 'all' || profile.pathType === filters.pathType;
            const matchesClass = filters.classYear === 'all' || profile.classYear === filters.classYear;
            const matchesAvailability = !filters.willingOnly || profile.willingToChat;

            return matchesQuery && matchesStatus && matchesPath && matchesClass && matchesAvailability;
        });
    }, [profiles, filters]);

    const classYearDistribution = useMemo(() => {
        const counts = profiles.reduce((accumulator, profile) => {
            if (!profile.classYear) return accumulator;
            accumulator[profile.classYear] = (accumulator[profile.classYear] || 0) + 1;
            return accumulator;
        }, {});
        return Object.entries(counts).sort(([left], [right]) => left.localeCompare(right));
    }, [profiles]);

    const dashboardMetrics = useMemo(() => {
        const alumniCount = profiles.filter(profile => profile.status === 'alumni' && profile.profileType !== 'unaffiliated').length;
        const currentCount = profiles.filter(profile => profile.status === 'current').length;
        const locationCount = new Set(profiles.map(profile => profile.location).filter(Boolean)).size;
        const yearValues = classYearDistribution.map(([year]) => year);
        const yearSpread = yearValues.length ? `${yearValues[0]}-${yearValues[yearValues.length - 1]}` : 'No years yet';

        return [
            { label: 'Profiles', value: profiles.length, detail: `${currentCount} current members` },
            { label: 'Alumni', value: alumniCount, detail: `${Math.max(profiles.length - alumniCount, 0)} current or external` },
            { label: 'Class-year spread', value: classYearDistribution.length, detail: yearSpread },
            { label: 'Locations', value: locationCount, detail: locationCount ? 'standardized places' : 'not listed yet' }
        ];
    }, [classYearDistribution, profiles]);

    const profileMentionLookup = useMemo(() => {
        const lookup = new Map();
        profiles.forEach(profile => {
            const handle = getMentionHandle(profile);
            if (handle) lookup.set(handle, profile);
            const firstName = getProfileName(profile).split(/\s+/)[0]?.toLowerCase();
            if (firstName && !lookup.has(firstName)) lookup.set(firstName, profile);
        });
        return lookup;
    }, [profiles]);

    const feedMentionMatches = useMemo(() => {
        if (!feedMentionMenu.open) return [];

        const query = normalizeText(feedMentionMenu.query);
        return profiles
            .filter(profile => {
                const handle = getMentionHandle(profile);
                if (!handle) return false;

                const searchable = [
                    getProfileName(profile),
                    handle,
                    profile.email,
                    profile.ujlpRole,
                    getAlumniProfileLine(profile),
                    getPathLabel(profile)
                ].map(normalizeText).join(' ');

                return !query || searchable.includes(query);
            })
            .sort((left, right) => {
                const leftName = normalizeText(getProfileName(left));
                const rightName = normalizeText(getProfileName(right));
                const leftHandle = normalizeText(getMentionHandle(left));
                const rightHandle = normalizeText(getMentionHandle(right));
                const leftScore = leftName.startsWith(query) || leftHandle.startsWith(query) ? 0 : 1;
                const rightScore = rightName.startsWith(query) || rightHandle.startsWith(query) ? 0 : 1;
                if (leftScore !== rightScore) return leftScore - rightScore;
                return leftName.localeCompare(rightName);
            })
            .slice(0, 7);
    }, [feedMentionMenu.open, feedMentionMenu.query, profiles]);

    const feedCommentsByPostId = useMemo(() => (
        (portalContent.feedComments || []).reduce((lookup, comment) => {
            if (!lookup[comment.postId]) lookup[comment.postId] = [];
            lookup[comment.postId].push(comment);
            return lookup;
        }, {})
    ), [portalContent.feedComments]);

    const feedLikesByPostId = useMemo(() => (
        (portalContent.feedLikes || []).reduce((lookup, like) => {
            if (!lookup[like.postId]) lookup[like.postId] = [];
            lookup[like.postId].push(like);
            return lookup;
        }, {})
    ), [portalContent.feedLikes]);

    const feedCommentLikesByCommentId = useMemo(() => (
        (portalContent.feedCommentLikes || []).reduce((lookup, like) => {
            if (!lookup[like.commentId]) lookup[like.commentId] = [];
            lookup[like.commentId].push(like);
            return lookup;
        }, {})
    ), [portalContent.feedCommentLikes]);

    const notificationItems = useMemo(() => {
        if (!currentUserId) return [];

        const ownHandle = getMentionHandle(ownProfile || { fullName: session?.user?.email || '' });
        const isCurrentUserPost = (post) => {
            if (!post) return false;
            if (post.authorUserId && post.authorUserId === currentUserId) return true;

            const authorName = normalizeText(post.authorName);
            if (!authorName) return false;

            return [
                ownProfile?.fullName,
                session?.user?.email,
                accountName
            ].some(value => normalizeText(value) === authorName);
        };
        const feedPostsById = new Map((portalContent.feedPosts || []).map(post => [post.id, post]));
        const feedCommentsById = new Map((portalContent.feedComments || []).map(comment => [comment.id, comment]));
        const isCurrentUserComment = (comment) => {
            if (!comment) return false;
            if (comment.authorUserId && comment.authorUserId === currentUserId) return true;

            return [
                ownProfile?.fullName,
                session?.user?.email,
                accountName
            ].some(value => normalizeText(value) === normalizeText(comment.authorName));
        };
        const items = [];

        (portalContent.feedPosts || []).forEach(post => {
            const mentioned = ownHandle && getMentionHandlesFromText(`${post.body || ''} ${(post.tags || []).join(' ')}`).includes(ownHandle);
            if (!isCurrentUserPost(post) || mentioned) {
                const authorProfile = profiles.find(profile => (
                    profile.userId === post.authorUserId || normalizeText(profile.fullName) === normalizeText(post.authorName)
                )) || null;
                items.push({
                    id: `post-${post.id}`,
                    type: mentioned ? 'Mention' : 'Feed post',
                    title: mentioned ? `${post.authorName || 'Someone'} mentioned you` : `${post.authorName || 'Someone'} posted to the feed`,
                    body: post.title || post.body,
                    createdAt: normalizeNotificationTime(post.createdAt),
                    postId: post.id,
                    photoKey: authorProfile?.photoKey || post.authorPhotoKey || 'blank'
                });
            }
        });

        (portalContent.feedComments || []).forEach(comment => {
            const post = feedPostsById.get(comment.postId);
            const mentioned = ownHandle && getMentionHandlesFromText(comment.body).includes(ownHandle);
            const onOwnPost = isCurrentUserPost(post);
            const isOwnComment = (
                comment.authorUserId === currentUserId ||
                [
                    ownProfile?.fullName,
                    session?.user?.email,
                    accountName
                ].some(value => normalizeText(value) === normalizeText(comment.authorName))
            );
            if (onOwnPost || (mentioned && !isOwnComment)) {
                const commentAuthorProfile = profiles.find(profile => (
                    profile.userId === comment.authorUserId || normalizeText(profile.fullName) === normalizeText(comment.authorName)
                )) || null;
                items.push({
                    id: `comment-${comment.id}`,
                    type: mentioned ? 'Comment mention' : 'Comment',
                    title: mentioned
                        ? `${comment.authorName} mentioned you in a comment`
                        : `${isOwnComment ? 'You' : comment.authorName} commented on your post`,
                    body: comment.body,
                    createdAt: normalizeNotificationTime(comment.createdAt),
                    postId: comment.postId,
                    photoKey: commentAuthorProfile?.photoKey || comment.authorPhotoKey || 'blank'
                });
            }
        });

        (portalContent.feedLikes || []).forEach(like => {
            const post = feedPostsById.get(like.postId);
            if (isCurrentUserPost(post) && like.userId !== currentUserId) {
                const likeProfile = profiles.find(profile => (
                    profile.userId === like.userId || normalizeText(profile.fullName) === normalizeText(like.userName)
                )) || null;
                items.push({
                    id: `like-${like.postId}-${like.userId}`,
                    type: 'Like',
                    title: `${like.userName} liked your post`,
                    body: post.title || post.body,
                    createdAt: normalizeNotificationTime(like.createdAt),
                    postId: like.postId,
                    photoKey: likeProfile?.photoKey || like.userPhotoKey || 'blank'
                });
            }
        });

        (portalContent.feedCommentLikes || []).forEach(like => {
            const comment = feedCommentsById.get(like.commentId);
            const post = feedPostsById.get(like.postId || comment?.postId);
            if (isCurrentUserComment(comment) && like.userId !== currentUserId) {
                const likeProfile = profiles.find(profile => (
                    profile.userId === like.userId || normalizeText(profile.fullName) === normalizeText(like.userName)
                )) || null;
                items.push({
                    id: `comment-like-${like.commentId}-${like.userId}`,
                    type: 'Like',
                    title: `${like.userName} liked your comment`,
                    body: comment.body,
                    createdAt: normalizeNotificationTime(like.createdAt),
                    postId: post?.id || comment.postId,
                    photoKey: likeProfile?.photoKey || like.userPhotoKey || 'blank'
                });
            }
        });

        (portalContent.announcements || []).forEach(announcement => {
            const announcementAuthorProfile = profiles.find(profile => (
                profile.userId === announcement.authorUserId || normalizeText(profile.fullName) === normalizeText(announcement.authorName)
            )) || null;
            items.push({
                id: `announcement-${announcement.id}`,
                type: announcement.category || 'Announcement',
                title: announcement.title,
                body: announcement.body,
                createdAt: normalizeNotificationTime(announcement.createdAt || announcement.publishDate),
                postId: '',
                photoKey: announcementAuthorProfile?.photoKey || announcement.authorPhotoKey || 'blank'
            });
        });

        (portalContent.tasks || []).forEach(task => {
            const taskAuthorProfile = profiles.find(profile => (
                profile.userId === task.authorUserId || normalizeText(profile.fullName) === normalizeText(task.authorName)
            )) || null;
            items.push({
                id: `task-${task.id}`,
                type: task.role || 'Task',
                title: task.title,
                body: task.details,
                createdAt: normalizeNotificationTime(task.createdAt || task.dueDate),
                postId: '',
                photoKey: taskAuthorProfile?.photoKey || task.authorPhotoKey || 'blank'
            });
        });

        const dismissedIds = new Set(dismissedNotificationIds);
        return items
            .filter(item => !dismissedIds.has(item.id))
            .sort((left, right) => String(right.createdAt || '').localeCompare(String(left.createdAt || '')));
    }, [accountName, currentUserId, dismissedNotificationIds, ownProfile, portalContent.announcements, portalContent.feedCommentLikes, portalContent.feedComments, portalContent.feedLikes, portalContent.feedPosts, portalContent.tasks, profiles, session?.user?.email]);

    const unreadNotificationCount = useMemo(() => {
        if (!notificationsSeenAt) return notificationItems.length;
        return notificationItems.filter(item => String(item.createdAt || '') > notificationsSeenAt).length;
    }, [notificationItems, notificationsSeenAt]);

    useEffect(() => {
        if (activeView !== 'notifications' || !currentUserId || !session) return;
        fetchPortalContent(session).then(content => setPortalContent({ ...defaultPortalContentState, ...content }));
    }, [activeView, currentUserId, session]);

    useEffect(() => {
        if (activeView !== 'notifications' || !currentUserId) return;
        const seenAt = new Date().toISOString();
        window.localStorage.setItem(getNotificationSeenKey(currentUserId), seenAt);
        setNotificationsSeenAt(seenAt);
        dispatchNotificationsChanged();
    }, [activeView, currentUserId, notificationItems.length]);

    const updateFilter = (key, value) => {
        setFilters(current => ({ ...current, [key]: value }));
    };

    const openDirectory = () => {
        setActiveView('directory');
    };

    const openProfileView = (profile) => {
        setEditingProfileUserId(profile.userId);
        setActiveView('profile');
    };

    const getProfileEditPath = (profile) => {
        const targetUserId = profile?.userId || '';
        if (isAdmin && targetUserId && targetUserId !== session?.user?.id) {
            return `/alumni/profile?userId=${encodeURIComponent(targetUserId)}`;
        }

        return '/alumni/profile';
    };

    useEffect(() => {
        if (!session?.user?.id) return;
        const params = new URLSearchParams(location.search);
        if (params.get('profile') !== 'edit') return;

        navigate('/alumni/profile', { replace: true });
    }, [location.search, navigate, session?.user?.id]);

    const getCurrentActor = () => ({
        userId: currentUserId,
        name: ownProfile?.fullName || session?.user?.email || 'UJLP member',
        photoKey: ownProfile?.photoKey || 'blank'
    });

    const resetEditorDraft = () => {
        setEditorDraft({
            title: '',
            body: '',
            category: 'Update',
            postType: 'update',
            eventDate: '',
            deadlineDate: '',
            publishDate: '',
            role: 'Writers',
            dueDate: '',
            priority: 'medium',
            tagsText: '',
            pinned: false
        });
    };

    const handleEditorSave = async (event) => {
        event.preventDefault();
        if (!isAdmin) return;

        setEditorMessage('');
        try {
            const actor = getCurrentActor();
            const actorFields = {
                authorUserId: actor.userId,
                authorName: actor.name,
                authorPhotoKey: actor.photoKey
            };
            const baseItem = {
                title: editorDraft.title,
                body: editorDraft.body,
                category: editorDraft.category,
                pinned: editorDraft.pinned,
                ...actorFields
            };
            const itemByType = {
                announcements: {
                    ...baseItem,
                    tags: toTags(editorDraft.tagsText),
                    publishDate: editorDraft.publishDate,
                    audience: 'public',
                    taggedUserIds: []
                },
                tasks: {
                    title: editorDraft.title,
                    details: editorDraft.body,
                    role: editorDraft.role,
                    dueDate: editorDraft.dueDate,
                    priority: editorDraft.priority,
                    status: 'open',
                    ...actorFields
                }
            };
            const saved = await savePortalItem(editorType, itemByType[editorType], session);
            const savedWithActor = {
                ...saved,
                authorUserId: saved.authorUserId || actor.userId,
                authorName: saved.authorName || actor.name,
                authorPhotoKey: saved.authorPhotoKey || actor.photoKey
            };
            setPortalContent(current => ({
                ...current,
                [editorType]: [savedWithActor, ...current[editorType].filter(item => item.id !== saved.id)]
            }));
            dispatchNotificationsChanged();
            setEditorMessage('Saved.');
            resetEditorDraft();
        } catch (error) {
            setEditorMessage(error.message);
        }
    };

    const handleEditorDelete = async (collection, id) => {
        if (!isAdmin) return;
        setEditorMessage('');
        try {
            await deletePortalItem(collection, id, session);
            setPortalContent(current => ({
                ...current,
                [collection]: current[collection].filter(item => item.id !== id)
            }));
            dispatchNotificationsChanged();
            setEditorMessage('Deleted.');
        } catch (error) {
            setEditorMessage(error.message);
        }
    };

    const closeFeedComposer = () => {
        setFeedDraft(defaultFeedDraft);
        setFeedMentionMenu(defaultFeedMentionMenu);
        setFeedMessage('');
        setIsFeedComposerOpen(false);
    };

    const handleFeedSave = async (event) => {
        event.preventDefault();
        if (!session) return;

        setFeedMessage('');
        try {
            const saved = await savePortalItem('feedPosts', {
                id: feedDraft.id || undefined,
                title: feedDraft.title,
                body: feedDraft.body,
                category: feedDraft.category,
                postType: feedDraft.postType,
                eventDate: feedDraft.eventDate,
                deadlineDate: feedDraft.deadlineDate,
                authorUserId: feedDraft.authorUserId || session.user.id,
                authorName: feedDraft.authorName || ownProfile?.fullName || session.user.email,
                authorPhotoKey: feedDraft.authorPhotoKey || ownProfile?.photoKey || 'blank',
                pinned: Boolean(feedDraft.pinned),
                tags: toTags(feedDraft.tagsText)
            }, session);
            setPortalContent(current => ({
                ...current,
                feedPosts: [saved, ...current.feedPosts.filter(item => item.id !== saved.id)]
            }));
            dispatchNotificationsChanged();
            setFeedDraft(defaultFeedDraft);
            setFeedMentionMenu(defaultFeedMentionMenu);
            setIsFeedComposerOpen(false);
            setFeedMessage(feedDraft.id ? 'Feed post updated.' : 'Posted to the alumni feed.');
        } catch (error) {
            setFeedMessage(error.message);
        }
    };

    const handleFeedEdit = (post) => {
        setFeedDraft({
            id: post.id,
            title: post.title,
            body: post.body,
            category: post.category,
            postType: post.postType,
            eventDate: post.eventDate,
            deadlineDate: post.deadlineDate,
            tagsText: (post.tags || []).join(', '),
            pinned: Boolean(post.pinned),
            authorUserId: post.authorUserId,
            authorName: post.authorName,
            authorPhotoKey: post.authorPhotoKey
        });
        setFeedMessage('');
        setFeedMentionMenu(defaultFeedMentionMenu);
        setIsFeedComposerOpen(true);
        setActiveView('feed');
        window.requestAnimationFrame(() => feedPostTextareaRef.current?.focus());
    };

    const handleFeedDelete = async (id) => {
        if (!isAdmin) return;
        setFeedMessage('');
        try {
            await deletePortalItem('feedPosts', id, session);
            setPortalContent(current => ({
                ...current,
                feedPosts: current.feedPosts.filter(item => item.id !== id),
                feedComments: current.feedComments.filter(item => item.postId !== id),
                feedLikes: current.feedLikes.filter(item => item.postId !== id),
                feedCommentLikes: current.feedCommentLikes.filter(item => item.postId !== id)
            }));
            if (feedDraft.id === id) setFeedDraft(defaultFeedDraft);
            dispatchNotificationsChanged();
            setFeedMessage('Feed post deleted.');
        } catch (error) {
            setFeedMessage(error.message);
        }
    };

    const handleFeedTogglePin = async (post) => {
        if (!isAdmin) return;
        setFeedMessage('');
        try {
            const saved = await savePortalItem('feedPosts', {
                ...post,
                pinned: !post.pinned
            }, session);
            setPortalContent(current => ({
                ...current,
                feedPosts: [saved, ...current.feedPosts.filter(item => item.id !== saved.id)]
            }));
            if (feedDraft.id === saved.id) {
                setFeedDraft(current => ({ ...current, pinned: saved.pinned }));
            }
            setFeedMessage(saved.pinned ? 'Feed post pinned.' : 'Feed post unpinned.');
        } catch (error) {
            setFeedMessage(error.message);
        }
    };

    const handleFeedLike = async (post) => {
        if (!currentUserId) return;

        const liked = (feedLikesByPostId[post.id] || []).some(like => like.userId === currentUserId);
        try {
            const savedLike = await toggleFeedLike(post, getCurrentActor(), liked, session);
            setPortalContent(current => ({
                ...current,
                feedLikes: liked
                    ? current.feedLikes.filter(like => !(like.postId === post.id && like.userId === currentUserId))
                    : [savedLike, ...current.feedLikes.filter(like => !(like.postId === post.id && like.userId === currentUserId))]
            }));
            dispatchNotificationsChanged();
        } catch (error) {
            setFeedMessage(error.message);
        }
    };

    const handleFeedCommentLike = async (comment) => {
        if (!currentUserId) return;

        const liked = (feedCommentLikesByCommentId[comment.id] || []).some(like => like.userId === currentUserId);
        try {
            const savedLike = await toggleFeedCommentLike(comment, getCurrentActor(), liked, session);
            setPortalContent(current => ({
                ...current,
                feedCommentLikes: liked
                    ? current.feedCommentLikes.filter(like => !(like.commentId === comment.id && like.userId === currentUserId))
                    : [savedLike, ...current.feedCommentLikes.filter(like => !(like.commentId === comment.id && like.userId === currentUserId))]
            }));
            dispatchNotificationsChanged();
        } catch (error) {
            setFeedMessage(error.message);
        }
    };

    const handleCommentSave = async (event, post) => {
        event.preventDefault();
        const body = String(commentDrafts[post.id] || '').trim();
        if (!body || !currentUserId) return;

        try {
            const actor = getCurrentActor();
            const saved = await savePortalItem('feedComments', {
                postId: post.id,
                authorUserId: actor.userId,
                authorName: actor.name,
                authorPhotoKey: actor.photoKey,
                body
            }, session);
            setPortalContent(current => ({
                ...current,
                feedComments: [...current.feedComments, saved]
            }));
            setCommentDrafts(current => ({ ...current, [post.id]: '' }));
            dispatchNotificationsChanged();
        } catch (error) {
            setFeedMessage(error.message);
        }
    };

    const handleCommentDelete = async (comment) => {
        if (!isAdmin && comment.authorUserId !== currentUserId) return;

        try {
            await deletePortalItem('feedComments', comment.id, session);
            setPortalContent(current => ({
                ...current,
                feedComments: current.feedComments.filter(item => item.id !== comment.id),
                feedCommentLikes: current.feedCommentLikes.filter(item => item.commentId !== comment.id)
            }));
            dispatchNotificationsChanged();
        } catch (error) {
            setFeedMessage(error.message);
        }
    };

    const handleNotificationDismiss = (notificationId) => {
        if (!currentUserId) return;

        setDismissedNotificationIds(current => {
            const next = Array.from(new Set([...current, notificationId]));
            writeDismissedNotificationIds(currentUserId, next);
            dispatchNotificationsChanged();
            return next;
        });
    };

    const handleCalendarSave = async (event) => {
        event.preventDefault();
        if (!isAdmin) return;

        setCalendarMessage('');
        try {
            const saved = await savePortalItem('calendarEvents', {
                id: calendarDraft.id || undefined,
                title: calendarDraft.title,
                details: calendarDraft.details,
                category: calendarDraft.category,
                eventDate: calendarDraft.eventDate,
                startTime: calendarDraft.startTime,
                endTime: calendarDraft.endTime,
                location: calendarDraft.location,
                linkUrl: calendarDraft.linkUrl,
                pinned: Boolean(calendarDraft.pinned)
            }, session);
            setPortalContent(current => ({
                ...current,
                calendarEvents: [saved, ...current.calendarEvents.filter(item => item.id !== saved.id)]
            }));
            setCalendarDraft(createDefaultCalendarDraft());
            if (saved.eventDate) {
                const savedDate = parseCalendarDate(saved.eventDate);
                if (savedDate) setCalendarWeekStart(toCalendarDateValue(getCalendarWeekStart(savedDate)));
            }
            setCalendarMessage(calendarDraft.id ? 'Calendar event updated.' : 'Calendar event added.');
        } catch (error) {
            setCalendarMessage(error.message);
        }
    };

    const handleCalendarEdit = (eventItem) => {
        setCalendarDraft({
            id: eventItem.id || '',
            title: eventItem.title || '',
            details: eventItem.details || '',
            category: eventItem.category || 'Event',
            eventDate: eventItem.eventDate || '',
            startTime: eventItem.startTime || '',
            endTime: eventItem.endTime || '',
            location: eventItem.location || '',
            linkUrl: eventItem.linkUrl || '',
            pinned: Boolean(eventItem.pinned)
        });
        const eventDate = parseCalendarDate(eventItem.eventDate);
        if (eventDate) setCalendarWeekStart(toCalendarDateValue(getCalendarWeekStart(eventDate)));
        setCalendarMessage('');
        setActiveView('calendar');
    };

    const handleCalendarDelete = async (id) => {
        if (!isAdmin) return;
        setCalendarMessage('');
        try {
            await deletePortalItem('calendarEvents', id, session);
            setPortalContent(current => ({
                ...current,
                calendarEvents: current.calendarEvents.filter(item => item.id !== id)
            }));
            if (calendarDraft.id === id) setCalendarDraft(createDefaultCalendarDraft());
            if (selectedCalendarEventId === id) setSelectedCalendarEventId('');
            setCalendarMessage('Calendar event deleted.');
        } catch (error) {
            setCalendarMessage(error.message);
        }
    };

    const renderDashboard = () => (
        <section className="alumni-dashboard">
            <div className="section-content">
                <div className="alumni-dashboard-overview">
                    <div className="alumni-panel-heading">
                        <span>Network snapshot</span>
                        <strong>Profiles, alumni, and class-year reach</strong>
                    </div>
                    <div className="alumni-metrics" aria-label="Directory summary">
                        {dashboardMetrics.map(metric => (
                            <div key={metric.label}>
                                <strong>{metric.value}</strong>
                                <span>{metric.label}</span>
                                <p>{metric.detail}</p>
                            </div>
                        ))}
                    </div>
                    <div className="alumni-class-year-spread" aria-label="Class year distribution">
                        {classYearDistribution.length > 0 ? classYearDistribution.map(([year, count]) => {
                            const maxCount = Math.max(...classYearDistribution.map(([, value]) => value), 1);
                            return (
                                <div key={year}>
                                    <span>{year}</span>
                                    <i style={{ '--year-share': `${Math.max((count / maxCount) * 100, 12)}%` }} />
                                    <b>{count}</b>
                                </div>
                            );
                        }) : <p className="alumni-system-note">Class years will appear as profiles are added.</p>}
                    </div>
                </div>
            </div>
        </section>
    );

    const renderProfileCard = (profile) => (
        <article className="alumni-profile-row" key={profile.userId || profile.id}>
            <div className="alumni-profile-photo" aria-hidden="true">
                <img src={getAlumniPhoto(profile.photoKey)} alt="" />
            </div>
            <div className="alumni-profile-main">
                <div className="alumni-profile-title">
                    <span>{getAlumniProfileTypeLabel(profile)}</span>
                    <span>{getPathLabel(profile)}</span>
                    {profile.isExample && <b>Preview</b>}
                    {!profile.directoryVisible && <b>Hidden</b>}
                </div>
                <h3>{getProfileName(profile)}</h3>
                <p>{getAlumniProfileLine(profile) || 'Profile details pending'}</p>
            </div>
            <div className="alumni-profile-details">
                <div><span>Employer / school</span><strong>{getAlumniPrimaryOrg(profile) || 'Not provided'}</strong></div>
                <div><span>Role</span><strong>{getPrimaryAlumniJob(profile)?.title || profile.currentTitle || profile.industry || 'Not provided'}</strong></div>
                <div><span>Location</span><strong>{profile.location || 'Not provided'}</strong></div>
                <div><span>Updated</span><strong>{formatUpdatedDate(profile.updatedAt)}</strong></div>
            </div>
            <div className="alumni-profile-footer">
                <div className="alumni-tags">
                    {(profile.interests || []).slice(0, 4).map(tag => <span key={tag}>{tag}</span>)}
                    {(!profile.interests || profile.interests.length === 0) && <span>No interests listed</span>}
                </div>
                <div className="alumni-contact-actions">
                    {profile.email ? (
                        <a href={`mailto:${profile.email}`}>{profile.email}</a>
                    ) : (
                        <span>Email pending</span>
                    )}
                    {profile.linkedinUrl && <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
                    <button type="button" onClick={() => openProfileView(profile)}>View</button>
                    {(profile.userId === session?.user?.id || isAdmin) && (
                        <Link to={getProfileEditPath(profile)}>
                            {profile.userId === session?.user?.id ? 'Manage profile' : 'Edit profile'}
                        </Link>
                    )}
                </div>
            </div>
        </article>
    );

    const renderDirectory = () => (
        <section className="alumni-directory-section">
            <div className="section-content">
                <div className="alumni-tools">
                    <label className="alumni-search">
                        <span>Search</span>
                        <input
                            type="search"
                            placeholder="Company, law school, name, city, role..."
                            value={filters.query}
                            onChange={(event) => updateFilter('query', event.target.value)}
                        />
                    </label>
                    <label>
                        <span>Status</span>
                        <select value={filters.status} onChange={(event) => updateFilter('status', event.target.value)}>
                            {Object.entries(statusLabels).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        <span>Path</span>
                        <select value={filters.pathType} onChange={(event) => updateFilter('pathType', event.target.value)}>
                            {Object.entries(pathTypeLabels).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        <span>Class</span>
                        <select value={filters.classYear} onChange={(event) => updateFilter('classYear', event.target.value)}>
                            {classYears.map(value => (
                                <option key={value} value={value}>{value === 'all' ? 'All years' : value}</option>
                            ))}
                        </select>
                    </label>
                    <label className="alumni-checkbox">
                        <input
                            type="checkbox"
                            checked={filters.willingOnly}
                            onChange={(event) => updateFilter('willingOnly', event.target.checked)}
                        />
                        <span>Open to outreach</span>
                    </label>
                </div>

                <div className="alumni-results-heading">
                    <p>{loading ? 'Loading profiles...' : `${filteredProfiles.length} result${filteredProfiles.length === 1 ? '' : 's'}`}</p>
                    <button type="button" onClick={() => setFilters(defaultFilters)}>Clear filters</button>
                </div>

                <div className="alumni-results">
                    {filteredProfiles.map(renderProfileCard)}
                </div>
            </div>
        </section>
    );

    const renderProfileView = () => {
        if (!activeProfile) {
            return (
                <section className="alumni-profile-section">
                    <div className="section-content">
                        {editingProfileUserId === session?.user?.id || !editingProfileUserId ? (
                            <div className="alumni-empty-profile">
                                <p className="jh-section-label">My profile</p>
                                <h2>You do not have a profile yet.</h2>
                                <p>
                                    Use the UJLP alumni invite code to create your directory profile.
                                </p>
                                <Link to="/alumni/profile" className="alumni-primary-action">Manage profile</Link>
                            </div>
                        ) : (
                            <p className="alumni-form-message">Profile unavailable.</p>
                        )}
                    </div>
                </section>
            );
        }

        const isOwnProfile = activeProfile.userId === session?.user?.id;
        const facts = [
            ['Profile type', getAlumniProfileTypeLabel(activeProfile)],
            ['UJLP role', activeProfile.ujlpRole],
            [activeProfile.profileType === 'uva-law-student' ? 'Law class year' : 'Class year', activeProfile.classYear],
            ['Path', getPathLabel(activeProfile)],
            ['Current title', getPrimaryAlumniJob(activeProfile)?.title || activeProfile.currentTitle],
            ['Employer / school', getAlumniPrimaryOrg(activeProfile)],
            ['Major or program', activeProfile.undergradMajor],
            ['Highest degree', activeProfile.degreeTitle],
            ['Location', activeProfile.location],
            ['Updated', formatUpdatedDate(activeProfile.updatedAt)]
        ];

        return (
            <section className="alumni-profile-section">
                <div className="section-content">
                    <div className="alumni-profile-view">
                        <div className="alumni-profile-view-header">
                            <div className="alumni-profile-photo alumni-profile-photo-large" aria-hidden="true">
                                <img src={getAlumniPhoto(activeProfile.photoKey)} alt="" />
                            </div>
                            <div>
                                <div className="alumni-profile-title">
                                    <span>{getAlumniProfileTypeLabel(activeProfile)}</span>
                                    <span>{activeProfile.willingToChat ? 'Open to outreach' : 'Not currently open'}</span>
                                    {!activeProfile.directoryVisible && <b>Hidden</b>}
                                    {isAdmin && !isOwnProfile && <b>Admin view</b>}
                                </div>
                                <h2>{getProfileName(activeProfile)}</h2>
                                <p>{getAlumniProfileLine(activeProfile) || 'Profile details pending'}</p>
                            </div>
                            <div className="alumni-profile-view-actions">
                                {(isOwnProfile || isAdmin) && (
                                    <Link to={getProfileEditPath(activeProfile)} className="alumni-primary-action">
                                        {isOwnProfile ? 'Manage profile' : 'Edit profile'}
                                    </Link>
                                )}
                                <button type="button" className="alumni-secondary-action" onClick={openDirectory}>Back to directory</button>
                            </div>
                        </div>

                        <div className="alumni-profile-view-grid">
                            <div className="alumni-profile-bio">
                                <span>Bio</span>
                                <p>{activeProfile.bio || 'No bio has been added yet.'}</p>
                            </div>
                            <div className="alumni-profile-facts">
                                {facts.map(([label, value]) => (
                                    <div key={label}>
                                        <span>{label}</span>
                                        <strong>{value || 'Not provided'}</strong>
                                    </div>
                                ))}
                            </div>
                            <div className="alumni-profile-contact">
                                <span>Contact</span>
                                <div>
                                    {activeProfile.email ? <a href={`mailto:${activeProfile.email}`}>{activeProfile.email}</a> : <strong>Email pending</strong>}
                                    {activeProfile.linkedinUrl && <a href={activeProfile.linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
                                </div>
                            </div>
                            <div className="alumni-tags alumni-profile-tags">
                                {(activeProfile.interests || []).map(tag => <span key={tag}>{tag}</span>)}
                                {(!activeProfile.interests || activeProfile.interests.length === 0) && <span>No interests listed</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    };

    const sortedCalendarEvents = useMemo(() => (
        [...(portalContent.calendarEvents || [])].sort((left, right) => {
            if (left.pinned !== right.pinned) return left.pinned ? -1 : 1;
            const leftDate = `${left.eventDate || '9999-12-31'}T${left.startTime || '23:59'}`;
            const rightDate = `${right.eventDate || '9999-12-31'}T${right.startTime || '23:59'}`;
            return leftDate.localeCompare(rightDate);
        })
    ), [portalContent.calendarEvents]);

    const upcomingItems = useMemo(() => sortedCalendarEvents.slice(0, 4), [sortedCalendarEvents]);

    const selectedCalendarEvent = useMemo(() => {
        if (!selectedCalendarEventId) return null;
        return (portalContent.calendarEvents || []).find(eventItem => eventItem.id === selectedCalendarEventId) || null;
    }, [portalContent.calendarEvents, selectedCalendarEventId]);

    useEffect(() => {
        if (activeView !== 'calendar' && selectedCalendarEventId) {
            setSelectedCalendarEventId('');
        }
    }, [activeView, selectedCalendarEventId]);

    const calendarWeekDays = useMemo(() => {
        const fallbackWeekStart = getDefaultCalendarWeekStart(portalContent.calendarEvents || []);
        const startDate = parseCalendarDate(calendarWeekStart || fallbackWeekStart) || new Date();
        const todayValue = toCalendarDateValue(new Date());
        return Array.from({ length: 7 }, (_, index) => {
            const date = addCalendarDays(startDate, index);
            const dateValue = toCalendarDateValue(date);
            return {
                date,
                dateValue,
                weekday: date.toLocaleDateString(undefined, { weekday: 'short' }),
                dayNumber: date.toLocaleDateString(undefined, { day: 'numeric' }),
                month: date.toLocaleDateString(undefined, { month: 'short' }),
                isToday: dateValue === todayValue
            };
        });
    }, [calendarWeekStart, portalContent.calendarEvents]);

    const calendarWeekLabel = useMemo(() => formatWeekRange(calendarWeekDays), [calendarWeekDays]);

    const calendarEventsByDate = useMemo(() => {
        const grouped = {};
        calendarWeekDays.forEach(day => {
            grouped[day.dateValue] = [];
        });

        [...(portalContent.calendarEvents || [])]
            .filter(eventItem => grouped[eventItem.eventDate])
            .sort((left, right) => {
                const leftDate = `${left.eventDate || '9999-12-31'}T${left.startTime || '23:59'}`;
                const rightDate = `${right.eventDate || '9999-12-31'}T${right.startTime || '23:59'}`;
                return leftDate.localeCompare(rightDate);
            })
            .forEach(eventItem => {
                grouped[eventItem.eventDate].push(eventItem);
            });

        return grouped;
    }, [calendarWeekDays, portalContent.calendarEvents]);

    const moveCalendarWeek = (direction) => {
        const currentStart = calendarWeekDays[0]?.date || new Date();
        setCalendarWeekStart(toCalendarDateValue(addCalendarDays(currentStart, direction * 7)));
        setSelectedCalendarEventId('');
    };

    const resetCalendarWeek = () => {
        setCalendarWeekStart('');
        setSelectedCalendarEventId('');
    };

    const sortedFeedPosts = useMemo(() => (
        [...portalContent.feedPosts].sort((left, right) => {
            if (left.pinned !== right.pinned) return left.pinned ? -1 : 1;
            return String(right.createdAt).localeCompare(String(left.createdAt));
        })
    ), [portalContent.feedPosts]);

    const getFeedAuthorProfile = (post) => profiles.find(profile => (
        profile.userId === post.authorUserId || normalizeText(profile.fullName) === normalizeText(post.authorName)
    )) || null;

    const getCommentAuthorProfile = (comment) => profiles.find(profile => (
        profile.userId === comment.authorUserId || normalizeText(profile.fullName) === normalizeText(comment.authorName)
    )) || null;

    const getLikeAuthorProfile = (like) => profiles.find(profile => (
        profile.userId === like.userId || normalizeText(profile.fullName) === normalizeText(like.userName)
    )) || null;

    const formatLikeSummary = (likes) => {
        const names = likes
            .map(like => like.userName)
            .filter(Boolean);
        if (names.length === 0) return 'No likes yet';
        if (names.length === 1) return `${names[0]} liked this`;
        if (names.length === 2) return `${names[0]} and ${names[1]} liked this`;
        return `${names[0]} and ${names.length - 1} other${names.length - 1 === 1 ? '' : 's'} liked this`;
    };

    const renderLikeIcon = () => (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M7 10v10H3V10h4Zm4.2 10H9V9.6L13.1 3l.8.1c1.4.2 2.3 1.5 2 2.9l-.6 3h3.1c1.6 0 2.7 1.5 2.3 3l-1.4 5.3A3.5 3.5 0 0 1 16 20h-4.8Z" />
        </svg>
    );

    const updateFeedMentionMenu = (value, cursorIndex) => {
        const activeMention = getActiveFeedMention(value, cursorIndex);
        if (!activeMention) {
            setFeedMentionMenu(defaultFeedMentionMenu);
            return;
        }

        setFeedMentionMenu(current => ({
            ...activeMention,
            open: true,
            activeIndex: current.query === activeMention.query ? current.activeIndex : 0
        }));
    };

    const handleFeedBodyChange = (event) => {
        const nextBody = event.target.value;
        setFeedDraft(current => ({ ...current, body: nextBody }));
        updateFeedMentionMenu(nextBody, event.target.selectionStart);
    };

    const handleFeedBodySelection = (event) => {
        updateFeedMentionMenu(event.target.value, event.target.selectionStart);
    };

    const closeFeedMentionMenuSoon = () => {
        window.setTimeout(() => setFeedMentionMenu(defaultFeedMentionMenu), 120);
    };

    const insertFeedMention = (profile) => {
        const handle = getMentionHandle(profile);
        if (!handle) return;

        const insertion = `@${handle}`;
        let nextCursorPosition = 0;

        setFeedDraft(current => {
            const body = current.body || '';
            const before = body.slice(0, feedMentionMenu.startIndex);
            const after = body.slice(feedMentionMenu.endIndex);
            const separator = after && /^[\s.,;:!?)]/.test(after) ? '' : ' ';
            nextCursorPosition = before.length + insertion.length + separator.length;

            return {
                ...current,
                body: `${before}${insertion}${separator}${after}`
            };
        });
        setFeedMentionMenu(defaultFeedMentionMenu);

        window.requestAnimationFrame(() => {
            if (!feedPostTextareaRef.current) return;
            feedPostTextareaRef.current.focus();
            feedPostTextareaRef.current.setSelectionRange(nextCursorPosition, nextCursorPosition);
        });
    };

    const handleFeedBodyKeyDown = (event) => {
        if (!feedMentionMenu.open) return;

        if (event.key === 'Escape') {
            event.preventDefault();
            setFeedMentionMenu(defaultFeedMentionMenu);
            return;
        }

        if (feedMentionMatches.length === 0) return;

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setFeedMentionMenu(current => ({
                ...current,
                activeIndex: (current.activeIndex + 1) % feedMentionMatches.length
            }));
            return;
        }

        if (event.key === 'ArrowUp') {
            event.preventDefault();
            setFeedMentionMenu(current => ({
                ...current,
                activeIndex: (current.activeIndex - 1 + feedMentionMatches.length) % feedMentionMatches.length
            }));
            return;
        }

        if (event.key === 'Enter' || event.key === 'Tab') {
            const activeProfile = feedMentionMatches[Math.min(feedMentionMenu.activeIndex, feedMentionMatches.length - 1)];
            if (!activeProfile) return;

            event.preventDefault();
            insertFeedMention(activeProfile);
        }
    };

    const renderPostBody = (post) => {
        const parts = String(post.body || '').split(/(@[a-zA-Z0-9._-]+)/g);
        return parts.map((part, index) => {
            if (!part.startsWith('@')) return part;
            const profile = profileMentionLookup.get(part.slice(1).replace(/[^a-zA-Z0-9]/g, '').toLowerCase());
            if (!profile) return part;
            return (
                <button type="button" className="alumni-inline-mention" key={`${post.id}-mention-${index}`} onClick={() => openProfileView(profile)}>
                    @{getMentionHandle(profile)}
                </button>
            );
        });
    };

    const renderFeedCard = (post) => (
        (() => {
            const authorProfile = getFeedAuthorProfile(post);
            const postComments = feedCommentsByPostId[post.id] || [];
            const postLikes = feedLikesByPostId[post.id] || [];
            const likedByMe = postLikes.some(like => like.userId === currentUserId);
            const likesExpanded = expandedLikePostId === post.id;
            const likeSummary = formatLikeSummary(postLikes);
            return (
                <article className="alumni-feed-card" key={post.id}>
                    <div className="alumni-feed-author">
                        <img src={getAlumniPhoto(authorProfile?.photoKey || post.authorPhotoKey || 'blank')} alt="" />
                        <div>
                            <span>{post.category}</span>
                            {authorProfile ? (
                                <button type="button" className="alumni-feed-author-link" onClick={() => openProfileView(authorProfile)}>
                                    {getProfileName(authorProfile)}
                                </button>
                            ) : (
                                <strong>{post.authorName || 'UJLP'}</strong>
                            )}
                            <time>{formatUpdatedDate(post.createdAt)}</time>
                        </div>
                        {post.pinned && <b>Pinned</b>}
                    </div>
                    <h3>{post.title}</h3>
                    <p>{renderPostBody(post)}</p>
                    <div className="alumni-tags">
                        {(post.tags || []).map(tag => <span key={tag}>{tag}</span>)}
                        {post.eventDate && <span>Event {formatShortDate(post.eventDate)}</span>}
                        {post.deadlineDate && <span>Due {formatShortDate(post.deadlineDate)}</span>}
                    </div>
                    <div className="alumni-feed-social">
                        <div className="alumni-feed-social-actions">
                            <button
                                type="button"
                                className={`alumni-like-button${likedByMe ? ' is-active' : ''}`}
                                aria-pressed={likedByMe}
                                onClick={() => handleFeedLike(post)}
                            >
                                {renderLikeIcon()}
                                {likedByMe ? 'Liked' : 'Like'}
                            </button>
                            <span>{postComments.length} comment{postComments.length === 1 ? '' : 's'}</span>
                        </div>
                        {postLikes.length > 0 ? (
                            <button
                                type="button"
                                className="alumni-like-summary-button"
                                aria-expanded={likesExpanded}
                                onClick={() => setExpandedLikePostId(current => current === post.id ? '' : post.id)}
                            >
                                {likeSummary}
                            </button>
                        ) : (
                            <p className="alumni-like-summary-text">{likeSummary}</p>
                        )}
                        {likesExpanded && (
                            <div className="alumni-like-dropdown">
                                {postLikes.length === 0 && <span>No one has liked this yet.</span>}
                                {postLikes.map(like => {
                                    const likeProfile = getLikeAuthorProfile(like);
                                    return (
                                        <div className="alumni-like-row" key={`${post.id}-${like.userId || like.userName}`}>
                                            <img src={getAlumniPhoto(likeProfile?.photoKey || like.userPhotoKey || 'blank')} alt="" />
                                            {likeProfile ? (
                                                <button type="button" className="alumni-feed-author-link" onClick={() => openProfileView(likeProfile)}>
                                                    {getProfileName(likeProfile)}
                                                </button>
                                            ) : (
                                                <strong>{like.userName || 'UJLP member'}</strong>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    <div className="alumni-feed-comments">
                        {postComments.map(comment => {
                            const canDeleteComment = isAdmin || comment.authorUserId === currentUserId;
                            const commentAuthorProfile = getCommentAuthorProfile(comment);
                            const commentLikes = feedCommentLikesByCommentId[comment.id] || [];
                            const commentLikedByMe = commentLikes.some(like => like.userId === currentUserId);
                            return (
                                <article className="alumni-feed-comment" key={comment.id}>
                                    <img src={getAlumniPhoto(commentAuthorProfile?.photoKey || comment.authorPhotoKey || 'blank')} alt="" />
                                    <div>
                                        <div>
                                            {commentAuthorProfile ? (
                                                <button type="button" className="alumni-feed-author-link" onClick={() => openProfileView(commentAuthorProfile)}>
                                                    {getProfileName(commentAuthorProfile)}
                                                </button>
                                            ) : (
                                                <strong>{comment.authorName || 'UJLP member'}</strong>
                                            )}
                                            <time>{formatUpdatedDate(comment.createdAt)}</time>
                                        </div>
                                        <p>{renderPostBody({ ...post, id: comment.id, body: comment.body })}</p>
                                        <div className="alumni-comment-social-actions">
                                            <button
                                                type="button"
                                                className={`alumni-like-button${commentLikedByMe ? ' is-active' : ''}`}
                                                aria-pressed={commentLikedByMe}
                                                onClick={() => handleFeedCommentLike(comment)}
                                            >
                                                {renderLikeIcon()}
                                                <span>{commentLikedByMe ? 'Liked' : 'Like'}</span>
                                                {commentLikes.length > 0 && (
                                                    <b className="alumni-comment-like-count-badge" aria-label={`${commentLikes.length} like${commentLikes.length === 1 ? '' : 's'}`}>
                                                        {commentLikes.length > 99 ? '99+' : commentLikes.length}
                                                    </b>
                                                )}
                                            </button>
                                            {canDeleteComment && (
                                                <button type="button" className="alumni-comment-delete-button" onClick={() => handleCommentDelete(comment)}>Delete</button>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                        <form className="alumni-feed-comment-form" onSubmit={(event) => handleCommentSave(event, post)}>
                            <input
                                value={commentDrafts[post.id] || ''}
                                onChange={(event) => setCommentDrafts(current => ({ ...current, [post.id]: event.target.value }))}
                                placeholder="Write a comment..."
                                aria-label={`Comment on ${post.title}`}
                            />
                            <button type="submit" className="alumni-secondary-action">Comment</button>
                        </form>
                    </div>
                    {isAdmin && (
                        <div className="alumni-feed-admin-actions">
                            <button type="button" className="alumni-secondary-action" onClick={() => handleFeedEdit(post)}>Edit</button>
                            <button type="button" className="alumni-secondary-action" onClick={() => handleFeedTogglePin(post)}>
                                {post.pinned ? 'Unpin' : 'Pin'}
                            </button>
                            <button type="button" className="alumni-secondary-action" onClick={() => handleFeedDelete(post.id)}>Delete</button>
                        </div>
                    )}
                </article>
            );
        })()
    );

    const renderCalendarEventCard = (eventItem, compact = false) => (
        <article className={compact ? 'alumni-upcoming-card' : 'alumni-calendar-card'} key={eventItem.id}>
            <span>{eventItem.category || 'Event'}</span>
            <strong>{eventItem.title}</strong>
            {!compact && <p>{eventItem.details || 'Details pending.'}</p>}
            <div className="alumni-calendar-meta">
                <time>{formatShortDate(eventItem.eventDate)}</time>
                <span>{formatCalendarTime(eventItem.startTime, eventItem.endTime)}</span>
                {eventItem.location && <span>{eventItem.location}</span>}
                {eventItem.pinned && <b>Pinned</b>}
            </div>
            {!compact && eventItem.linkUrl && (
                <a className="alumni-calendar-link" href={eventItem.linkUrl} target="_blank" rel="noopener noreferrer">Open link</a>
            )}
            {!compact && isAdmin && (
                <div className="alumni-feed-admin-actions">
                    <button type="button" className="alumni-secondary-action" onClick={() => handleCalendarEdit(eventItem)}>Edit</button>
                    <button type="button" className="alumni-secondary-action" onClick={() => handleCalendarDelete(eventItem.id)}>Delete</button>
                </div>
            )}
        </article>
    );

    const renderSelectedCalendarEvent = () => {
        if (!selectedCalendarEvent) return null;

        return (
            <article className="alumni-calendar-selection">
                <div className="alumni-calendar-selection-header">
                    <div className="alumni-panel-heading">
                        <span>{selectedCalendarEvent.category || 'Event'}</span>
                        <strong>{selectedCalendarEvent.title}</strong>
                    </div>
                    <button
                        type="button"
                        className="alumni-secondary-action"
                        onClick={() => setSelectedCalendarEventId('')}
                    >
                        Close
                    </button>
                </div>
                <p>{selectedCalendarEvent.details || 'Details pending.'}</p>
                <div className="alumni-calendar-meta">
                    <time>{formatShortDate(selectedCalendarEvent.eventDate)}</time>
                    <span>{formatCalendarTime(selectedCalendarEvent.startTime, selectedCalendarEvent.endTime)}</span>
                    {selectedCalendarEvent.location && <span>{selectedCalendarEvent.location}</span>}
                    {selectedCalendarEvent.pinned && <b>Pinned</b>}
                </div>
                {selectedCalendarEvent.linkUrl && (
                    <a className="alumni-calendar-link" href={selectedCalendarEvent.linkUrl} target="_blank" rel="noopener noreferrer">Open link</a>
                )}
                {isAdmin && (
                    <div className="alumni-feed-admin-actions">
                        <button type="button" className="alumni-secondary-action" onClick={() => handleCalendarEdit(selectedCalendarEvent)}>Edit</button>
                        <button type="button" className="alumni-secondary-action" onClick={() => handleCalendarDelete(selectedCalendarEvent.id)}>Delete</button>
                    </div>
                )}
            </article>
        );
    };

    const renderWeeklyCalendar = () => (
        <section className="alumni-calendar-board">
            <div className="alumni-calendar-board-header">
                <div className="alumni-panel-heading">
                    <span>Weekly calendar</span>
                    <strong>{calendarWeekLabel}</strong>
                </div>
                <div className="alumni-week-controls" aria-label="Calendar week controls">
                    <button type="button" className="alumni-secondary-action" onClick={() => moveCalendarWeek(-1)}>Previous week</button>
                    <button type="button" className="alumni-secondary-action" onClick={resetCalendarWeek}>Next event</button>
                    <button type="button" className="alumni-secondary-action" onClick={() => moveCalendarWeek(1)}>Next week</button>
                </div>
            </div>
            <div className="alumni-week-grid" aria-label="Weekly calendar">
                {calendarWeekDays.map(day => {
                    const dayEvents = calendarEventsByDate[day.dateValue] || [];
                    return (
                        <div className={`alumni-week-day${day.isToday ? ' is-today' : ''}`} key={day.dateValue}>
                            <div className="alumni-week-day-heading">
                                <span>{day.weekday}</span>
                                <strong>{day.dayNumber}</strong>
                                <em>{day.month}</em>
                            </div>
                            <div className="alumni-week-events">
                                {dayEvents.map(eventItem => (
                                    <button
                                        type="button"
                                        className={`alumni-week-event${selectedCalendarEventId === eventItem.id ? ' is-selected' : ''}`}
                                        key={eventItem.id}
                                        aria-pressed={selectedCalendarEventId === eventItem.id}
                                        onClick={() => setSelectedCalendarEventId(eventItem.id)}
                                    >
                                        <span>{eventItem.category || 'Event'}</span>
                                        <strong>{eventItem.title}</strong>
                                        <time>{formatCalendarTime(eventItem.startTime, eventItem.endTime)}</time>
                                        {eventItem.location && <small>{eventItem.location}</small>}
                                        {eventItem.pinned && <b>Pinned</b>}
                                    </button>
                                ))}
                                {dayEvents.length === 0 && <p>No events</p>}
                            </div>
                        </div>
                    );
                })}
            </div>
            {renderSelectedCalendarEvent()}
        </section>
    );

    const renderHome = () => (
        <div className="alumni-portal-stack">
            {renderDashboard()}
            <div className="alumni-home-grid">
                <section className="alumni-home-feed">
                    <div className="alumni-panel-heading">
                        <span>Feed</span>
                        <strong>Latest from the network</strong>
                    </div>
                    {sortedFeedPosts.slice(0, 3).map(renderFeedCard)}
                </section>
                <aside className="alumni-home-rail">
                    <div className="alumni-panel-heading">
                        <span>Upcoming</span>
                        <strong>Events and deadlines</strong>
                    </div>
                    {upcomingItems.map(item => renderCalendarEventCard(item, true))}
                    {upcomingItems.length === 0 && <p className="alumni-system-note">No calendar events are posted.</p>}
                </aside>
            </div>
        </div>
    );

    const renderFeed = () => (
        <div className="alumni-home-grid">
            <section className="alumni-home-feed">
                <div className="alumni-panel-heading alumni-feed-heading">
                    <div>
                        <span>Alumni network</span>
                        <strong>Member updates and opportunities</strong>
                    </div>
                    {!isFeedComposerOpen && (
                        <button
                            type="button"
                            className="alumni-primary-action"
                            onClick={() => {
                                setFeedDraft(defaultFeedDraft);
                                setFeedMessage('');
                                setFeedMentionMenu(defaultFeedMentionMenu);
                                setIsFeedComposerOpen(true);
                                window.requestAnimationFrame(() => feedPostTextareaRef.current?.focus());
                            }}
                        >
                            Make a post
                        </button>
                    )}
                </div>
                {isFeedComposerOpen && (
                    <form className="alumni-feed-composer" onSubmit={handleFeedSave}>
                        <div className="alumni-panel-heading alumni-feed-composer-heading">
                            <span>{feedDraft.id ? 'Editing feed post' : 'New feed post'}</span>
                            <strong>{feedDraft.id ? feedDraft.title || 'Untitled post' : 'Post to the network'}</strong>
                        </div>
                        <div className="alumni-form-grid">
                            <label>
                                <span>Title</span>
                                <input value={feedDraft.title} onChange={(event) => setFeedDraft(current => ({ ...current, title: event.target.value }))} required />
                            </label>
                            <label>
                                <span>Category</span>
                                <input value={feedDraft.category} onChange={(event) => setFeedDraft(current => ({ ...current, category: event.target.value }))} />
                            </label>
                            <div className="alumni-wide alumni-mention-label">
                                <label htmlFor="alumni-feed-post-body">Post</label>
                                <div className="alumni-mention-field">
                                    <textarea
                                        id="alumni-feed-post-body"
                                        ref={feedPostTextareaRef}
                                        value={feedDraft.body}
                                        onChange={handleFeedBodyChange}
                                        onClick={handleFeedBodySelection}
                                        onSelect={handleFeedBodySelection}
                                        onKeyDown={handleFeedBodyKeyDown}
                                        onBlur={closeFeedMentionMenuSoon}
                                        required
                                        rows="3"
                                        placeholder={profiles.length ? `Use @${getMentionHandle(profiles[0])} to mention a member` : 'Use @name to mention a member'}
                                        aria-controls={feedMentionMenu.open ? 'alumni-feed-mention-menu' : undefined}
                                        aria-haspopup="listbox"
                                    />
                                    {feedMentionMenu.open && (
                                        <div className="alumni-mention-menu" id="alumni-feed-mention-menu" role="listbox">
                                            {feedMentionMatches.length > 0 ? feedMentionMatches.map((profile, index) => {
                                                const handle = getMentionHandle(profile);
                                                return (
                                                    <button
                                                        type="button"
                                                        role="option"
                                                        aria-selected={feedMentionMenu.activeIndex === index}
                                                        className={feedMentionMenu.activeIndex === index ? 'is-active' : ''}
                                                        key={profile.userId || profile.id || handle}
                                                        onMouseEnter={() => setFeedMentionMenu(current => ({ ...current, activeIndex: index }))}
                                                        onMouseDown={(event) => {
                                                            event.preventDefault();
                                                            insertFeedMention(profile);
                                                        }}
                                                    >
                                                        <img src={getAlumniPhoto(profile.photoKey)} alt="" />
                                                        <span>
                                                            <strong>{getProfileName(profile)}</strong>
                                                            <small>{getAlumniProfileLine(profile) || profile.email || getPathLabel(profile)}</small>
                                                        </span>
                                                        <b>@{handle}</b>
                                                    </button>
                                                );
                                            }) : (
                                                <p>No directory matches</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <label>
                                <span>Type</span>
                                <select value={feedDraft.postType} onChange={(event) => setFeedDraft(current => ({ ...current, postType: event.target.value }))}>
                                    <option value="update">Update</option>
                                    <option value="event">Event</option>
                                    <option value="deadline">Deadline</option>
                                </select>
                            </label>
                            <label>
                                <span>Event date</span>
                                <input type="date" value={feedDraft.eventDate} onChange={(event) => setFeedDraft(current => ({ ...current, eventDate: event.target.value }))} />
                            </label>
                            <label>
                                <span>Deadline date</span>
                                <input type="date" value={feedDraft.deadlineDate} onChange={(event) => setFeedDraft(current => ({ ...current, deadlineDate: event.target.value }))} />
                            </label>
                            <label>
                                <span>Tags</span>
                                <input value={feedDraft.tagsText} onChange={(event) => setFeedDraft(current => ({ ...current, tagsText: event.target.value }))} placeholder="jobs, events, @memberhandle" />
                            </label>
                            {isAdmin && (
                                <label className="alumni-checkbox">
                                    <input type="checkbox" checked={feedDraft.pinned} onChange={(event) => setFeedDraft(current => ({ ...current, pinned: event.target.checked }))} />
                                    <span>Pin feed post</span>
                                </label>
                            )}
                        </div>
                        <div className="alumni-form-actions">
                            <button type="submit" className="alumni-primary-action">{feedDraft.id ? 'Save changes' : 'Post'}</button>
                            <button type="button" className="alumni-secondary-action" onClick={closeFeedComposer}>Cancel</button>
                        </div>
                        {feedMessage && <p className="alumni-form-message">{feedMessage}</p>}
                    </form>
                )}
                {sortedFeedPosts.map(renderFeedCard)}
            </section>
            <aside className="alumni-home-rail">
                <div className="alumni-panel-heading">
                    <span>Calendar</span>
                    <strong>Coming up</strong>
                </div>
                {upcomingItems.map(item => renderCalendarEventCard(item, true))}
                {upcomingItems.length === 0 && <p className="alumni-system-note">No calendar events are posted.</p>}
            </aside>
        </div>
    );

    const renderCalendar = () => (
        <div className="alumni-calendar-layout">
            {isAdmin && (
                <form className="alumni-calendar-form" onSubmit={handleCalendarSave} autoComplete="off">
                    <div className="alumni-panel-heading">
                        <span>{calendarDraft.id ? 'Editing calendar event' : 'New calendar event'}</span>
                        <strong>{calendarDraft.id ? calendarDraft.title || 'Untitled event' : 'Add to the calendar'}</strong>
                    </div>
                    <div className="alumni-form-grid">
                        <label>
                            <span>Title</span>
                            <input value={calendarDraft.title} onChange={(event) => setCalendarDraft(current => ({ ...current, title: event.target.value }))} required />
                        </label>
                        <label>
                            <span>Category</span>
                            <input value={calendarDraft.category} onChange={(event) => setCalendarDraft(current => ({ ...current, category: event.target.value }))} placeholder="Event, Deadline, Meeting" />
                        </label>
                        <label>
                            <span>Date</span>
                            <input type="date" value={calendarDraft.eventDate} onChange={(event) => setCalendarDraft(current => ({ ...current, eventDate: event.target.value }))} required autoComplete="off" />
                        </label>
                        <label>
                            <span>Start time</span>
                            <input type="time" value={calendarDraft.startTime} onChange={(event) => setCalendarDraft(current => ({ ...current, startTime: event.target.value }))} required autoComplete="off" />
                        </label>
                        <label>
                            <span>End time</span>
                            <input type="time" value={calendarDraft.endTime} onChange={(event) => setCalendarDraft(current => ({ ...current, endTime: event.target.value }))} required autoComplete="off" />
                        </label>
                        <label>
                            <span>Location</span>
                            <input value={calendarDraft.location} onChange={(event) => setCalendarDraft(current => ({ ...current, location: event.target.value }))} placeholder="Virtual, Charlottesville, etc." />
                        </label>
                        <label className="alumni-wide">
                            <span>Details</span>
                            <textarea value={calendarDraft.details} onChange={(event) => setCalendarDraft(current => ({ ...current, details: event.target.value }))} rows="3" />
                        </label>
                        <label>
                            <span>Link URL</span>
                            <input type="url" value={calendarDraft.linkUrl} onChange={(event) => setCalendarDraft(current => ({ ...current, linkUrl: event.target.value }))} placeholder="https://..." />
                        </label>
                        <label className="alumni-checkbox">
                            <input type="checkbox" checked={calendarDraft.pinned} onChange={(event) => setCalendarDraft(current => ({ ...current, pinned: event.target.checked }))} />
                            <span>Pin calendar event</span>
                        </label>
                    </div>
                    <div className="alumni-form-actions">
                        <button type="submit" className="alumni-primary-action">{calendarDraft.id ? 'Save event' : 'Add event'}</button>
                        {calendarDraft.id && (
                            <button type="button" className="alumni-secondary-action" onClick={() => setCalendarDraft(createDefaultCalendarDraft())}>New event</button>
                        )}
                    </div>
                    {calendarMessage && <p className="alumni-form-message">{calendarMessage}</p>}
                </form>
            )}
            <section className="alumni-calendar-list">
                <div className="alumni-panel-heading">
                    <span>Calendar</span>
                    <strong>Weekly events and deadlines</strong>
                </div>
                {renderWeeklyCalendar()}
                {sortedCalendarEvents.length === 0 && <p className="alumni-system-note">No calendar events are posted.</p>}
            </section>
        </div>
    );

    const renderResources = () => (
        <div className="alumni-resource-grid">
            {[
                ['Career Development', 'Law school applications, clerkship paths, internships, government service, and recruiting notes.'],
                ['Club Resources', 'Editorial standards, source collection, article development, and publication workflow materials.'],
                ['Alumni Outreach', 'Shared contacts, mentorship preferences, and tagged profiles from the private directory.'],
                ['UJLP Inbox', 'Use the contact button to email the Journal account for private questions and portal issues.']
            ].map(([title, body]) => (
                <article className="alumni-resource-card" key={title}>
                    <span>{title}</span>
                    <p>{body}</p>
                </article>
            ))}
            <a className="alumni-mail-action" href="mailto:ujlawandpolitics@gmail.com">Email UJLP</a>
        </div>
    );

    const renderTasks = () => (
        <div className="alumni-task-list">
            <div className="alumni-panel-heading">
                <span>Weekly tasks</span>
                <strong>For writers and editors</strong>
            </div>
            {portalContent.tasks.map(task => (
                <article className="alumni-task-card" key={task.id}>
                    <div>
                        <span>{task.role}</span>
                        <h3>{task.title}</h3>
                        <p>{task.details}</p>
                    </div>
                    <time>{formatShortDate(task.dueDate)}</time>
                </article>
            ))}
        </div>
    );

    const renderNotifications = () => (
        <div className="alumni-notification-list">
            <div className="alumni-panel-heading">
                <span>Notifications</span>
                <strong>{unreadNotificationCount > 0 ? `${unreadNotificationCount} unread update${unreadNotificationCount === 1 ? '' : 's'}` : 'All caught up'}</strong>
            </div>
            {notificationItems.map(item => (
                <article className="alumni-notification-card" key={item.id}>
                    <div className="alumni-feed-author">
                        <img src={getAlumniPhoto(item.photoKey || 'blank')} alt="" />
                        <div>
                            <span>{item.type}</span>
                            <strong>{item.title}</strong>
                            <time>{formatUpdatedDate(item.createdAt)}</time>
                        </div>
                    </div>
                    <p>{item.body}</p>
                    {item.postId && (
                        <button type="button" className="alumni-secondary-action" onClick={() => setActiveView('feed')}>
                            Open feed
                        </button>
                    )}
                    <button type="button" className="alumni-secondary-action" onClick={() => handleNotificationDismiss(item.id)}>
                        Dismiss
                    </button>
                </article>
            ))}
            {notificationItems.length === 0 && <p className="alumni-system-note">No notifications yet.</p>}
        </div>
    );

    const renderAdminEditor = () => {
        if (!isAdmin) return renderHome();

        const currentItems = portalContent[editorType] || [];
        return (
            <div className="alumni-admin-grid">
                <form className="alumni-admin-form" onSubmit={handleEditorSave}>
                    <div className="alumni-panel-heading">
                        <span>Internal team</span>
                        <strong>Create announcements and tasks</strong>
                    </div>
                    <div className="alumni-auth-tabs" aria-label="Editor type">
                        <button type="button" className={editorType === 'announcements' ? 'active' : ''} onClick={() => setEditorType('announcements')}>Announcements</button>
                        <button type="button" className={editorType === 'tasks' ? 'active' : ''} onClick={() => setEditorType('tasks')}>Tasks</button>
                    </div>
                    <label>
                        <span>Title</span>
                        <input value={editorDraft.title} onChange={(event) => setEditorDraft(current => ({ ...current, title: event.target.value }))} required />
                    </label>
                    <label>
                        <span>{editorType === 'tasks' ? 'Details' : 'Body'}</span>
                        <textarea value={editorDraft.body} onChange={(event) => setEditorDraft(current => ({ ...current, body: event.target.value }))} required rows="4" />
                    </label>
                    {editorType !== 'tasks' && (
                        <>
                            <label>
                                <span>Category</span>
                                <input value={editorDraft.category} onChange={(event) => setEditorDraft(current => ({ ...current, category: event.target.value }))} />
                            </label>
                            <label>
                                <span>Publish date</span>
                                <input type="date" value={editorDraft.publishDate} onChange={(event) => setEditorDraft(current => ({ ...current, publishDate: event.target.value }))} />
                            </label>
                            <label>
                                <span>Tags</span>
                                <input value={editorDraft.tagsText} onChange={(event) => setEditorDraft(current => ({ ...current, tagsText: event.target.value }))} placeholder="writers, events, alumni" />
                            </label>
                        </>
                    )}
                    {editorType === 'tasks' && (
                        <>
                            <label>
                                <span>Role</span>
                                <select value={editorDraft.role} onChange={(event) => setEditorDraft(current => ({ ...current, role: event.target.value }))}>
                                    <option>Writers</option>
                                    <option>Editors</option>
                                    <option>Leadership</option>
                                </select>
                            </label>
                            <label>
                                <span>Due date</span>
                                <input type="date" value={editorDraft.dueDate} onChange={(event) => setEditorDraft(current => ({ ...current, dueDate: event.target.value }))} />
                            </label>
                        </>
                    )}
                    <label className="alumni-checkbox">
                        <input type="checkbox" checked={editorDraft.pinned} onChange={(event) => setEditorDraft(current => ({ ...current, pinned: event.target.checked }))} />
                        <span>Pin this item</span>
                    </label>
                    <button type="submit" className="alumni-primary-action">Save item</button>
                    {editorMessage && <p className="alumni-form-message">{editorMessage}</p>}
                </form>

                <div className="alumni-admin-list">
                    <div className="alumni-panel-heading">
                        <span>Manage</span>
                        <strong>{editorType === 'announcements' ? 'Announcements' : 'Tasks'}</strong>
                    </div>
                    {currentItems.map(item => (
                        <article className="alumni-admin-item" key={item.id}>
                            <div>
                                <span>{item.category || item.role || 'Item'}</span>
                                <strong>{item.title}</strong>
                            </div>
                            <button type="button" className="alumni-secondary-action" onClick={() => handleEditorDelete(editorType, item.id)}>Delete</button>
                        </article>
                    ))}
                </div>
            </div>
        );
    };

    const renderActivePortalView = () => {
        if (activeView === 'home') return renderHome();
        if (activeView === 'feed') return renderFeed();
        if (activeView === 'calendar') return renderCalendar();
        if (activeView === 'directory') return renderDirectory();
        if (activeView === 'resources') return renderResources();
        if (activeView === 'tasks') return renderTasks();
        if (activeView === 'notifications') return renderNotifications();
        if (activeView === 'admin') return renderAdminEditor();
        if (activeView === 'profile') return renderProfileView();
        return renderHome();
    };

    const renderPortalShell = () => (
        <section className="alumni-portal-section">
            <div className="section-content alumni-portal-shell">
                <aside className="alumni-portal-sidebar">
                    <nav className="alumni-portal-nav" aria-label="Alumni portal">
                        {portalTabs.map(([key, label, iconPath]) => (
                            <button key={key} type="button" className={activeView === key ? 'active' : ''} onClick={() => setActiveView(key)}>
                                <Icon path={iconPath} />
                                <span>{label}</span>
                                {key === 'notifications' && unreadNotificationCount > 0 && (
                                    <b className="alumni-nav-badge">{unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}</b>
                                )}
                            </button>
                        ))}
                    </nav>
                    <a className="alumni-sidebar-mail" href="mailto:ujlawandpolitics@gmail.com">Contact UJLP</a>
                </aside>
                <div className="alumni-portal-main">
                    {authMessage && <p className="alumni-form-message">{authMessage}</p>}
                    {renderActivePortalView()}
                </div>
            </div>
        </section>
    );

    if (!session) {
        return <Navigate to="/alumni/signin" replace state={{ from: '/alumni' }} />;
    }

    return (
        <div className="alumni-directory alumni-directory-page jh-page fade-in">
            <section className="alumni-hero">
                <ParticleBackground />
                <div className="section-content alumni-hero-grid">
                    <div className="alumni-hero-copy">
                        <p className="jh-eyebrow"><strong>UJLP</strong> / Members Network</p>
                        <h1>Alumni<br /><em>Directory.</em></h1>
                        <p>
                            A private workspace for member profiles, career paths, law school information, and alumni contact preferences.
                        </p>
                    </div>
                    <div className="alumni-hero-panel">
                        <span>{session ? 'Active session' : 'Member access'}</span>
                        <strong>{session ? accountName : 'Sign in to continue'}</strong>
                        <p>{session ? `${profiles.length} profiles available${isAdmin ? ' with admin access' : ''}.` : 'Accounts are protected by Supabase Auth and UJLP directory permissions.'}</p>
                    </div>
                </div>
            </section>

            {renderPortalShell()}
        </div>
    );
}

export default AlumniDirectory;
