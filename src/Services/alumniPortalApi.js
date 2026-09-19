const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

const PORTAL_STORE_KEY = 'ujlp_alumni_portal_content';

const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

const fallbackFeedPosts = [
    {
        id: 'feed-welcome',
        title: 'Welcome to the UJLP alumni portal',
        body: 'Use this space for alumni updates, deadlines, event notes, and opportunities for the Journal network.',
        category: 'Network',
        postType: 'update',
        eventDate: '',
        deadlineDate: '',
        authorName: 'UJLP',
        authorPhotoKey: 'blank',
        pinned: true,
        tags: ['alumni', 'network'],
        createdAt: '2026-09-18T00:00:00.000Z'
    },
    {
        id: 'feed-writing-deadline',
        title: 'Fall article development checkpoint',
        body: 'Editors should confirm topic scope, source lists, and first-draft timing with active writers.',
        category: 'Deadline',
        postType: 'deadline',
        eventDate: '',
        deadlineDate: '2026-10-15',
        authorName: 'Editorial Board',
        authorPhotoKey: 'blank',
        pinned: false,
        tags: ['writers', 'editors'],
        createdAt: '2026-09-18T00:00:00.000Z'
    }
];

const fallbackAnnouncements = [
    {
        id: 'announcement-leadership',
        title: 'UJLP reorganizes under a new leadership team',
        body: 'UJLP restructured its leadership team and publishing pathways ahead of the upcoming semester.',
        category: 'Team Updates',
        publishDate: '2025-07-13',
        audience: 'public',
        taggedUserIds: [],
        pinned: true,
        createdAt: '2025-07-13T00:00:00.000Z'
    },
    {
        id: 'announcement-alumni-network',
        title: 'Alumni network opens for member profiles',
        body: 'Members can now sign in, browse the private directory, and create alumni profiles with an invite code.',
        category: 'Alumni',
        publishDate: '2026-09-18',
        audience: 'public',
        taggedUserIds: [],
        pinned: false,
        createdAt: '2026-09-18T00:00:00.000Z'
    }
];

const fallbackTasks = [
    {
        id: 'task-editor-checkins',
        title: 'Editor check-ins',
        details: 'Confirm writer progress and flag pieces that need source support.',
        role: 'Editors',
        dueDate: '2026-10-04',
        priority: 'high',
        status: 'open',
        createdAt: '2026-09-18T00:00:00.000Z'
    },
    {
        id: 'task-writer-sources',
        title: 'Source lists',
        details: 'Writers should collect primary sources, cases, and secondary support before drafting.',
        role: 'Writers',
        dueDate: '2026-10-08',
        priority: 'medium',
        status: 'open',
        createdAt: '2026-09-18T00:00:00.000Z'
    }
];

const fallbackCalendarEvents = [
    {
        id: 'calendar-welcome-meetup',
        title: 'Alumni portal office hours',
        details: 'Drop in for questions about profiles, directory access, and upcoming UJLP alumni features.',
        category: 'Office Hours',
        eventDate: '2026-10-02',
        startTime: '17:00',
        endTime: '18:00',
        location: 'Virtual',
        linkUrl: '',
        pinned: true,
        createdAt: '2026-09-18T00:00:00.000Z'
    },
    {
        id: 'calendar-editor-checkpoint',
        title: 'Fall editorial checkpoint',
        details: 'Editors and writers should confirm topic scope, source lists, and first-draft timing.',
        category: 'Deadline',
        eventDate: '2026-10-15',
        startTime: '',
        endTime: '',
        location: 'UJLP Portal',
        linkUrl: '',
        pinned: false,
        createdAt: '2026-09-18T00:00:00.000Z'
    }
];

const fallbackFeedComments = [];
const fallbackFeedLikes = [];

const emptyPortalContent = {
    feedPosts: fallbackFeedPosts,
    announcements: fallbackAnnouncements,
    tasks: fallbackTasks,
    calendarEvents: fallbackCalendarEvents,
    feedComments: fallbackFeedComments,
    feedLikes: fallbackFeedLikes
};

const readLocalPortalContent = () => {
    try {
        const value = window.localStorage.getItem(PORTAL_STORE_KEY);
        return value ? { ...emptyPortalContent, ...JSON.parse(value) } : emptyPortalContent;
    } catch {
        return emptyPortalContent;
    }
};

const writeLocalPortalContent = (content) => {
    window.localStorage.setItem(PORTAL_STORE_KEY, JSON.stringify(content));
};

const createId = (prefix) => {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const supabaseHeaders = (session) => ({
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${session?.access_token || SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json'
});

const supabaseRequest = async (path, options = {}, session = null) => {
    const response = await fetch(`${SUPABASE_URL}${path}`, {
        ...options,
        headers: {
            ...supabaseHeaders(session),
            ...(options.headers || {})
        }
    });
    const text = await response.text();
    const payload = text ? JSON.parse(text) : null;

    if (!response.ok) {
        throw new Error(payload?.msg || payload?.message || 'The portal service returned an error.');
    }

    return payload;
};

const normalizeTextArray = (value) => (Array.isArray(value) ? value.filter(Boolean) : []);

const normalizeFeedPost = (post) => ({
    id: post.id || createId('feed'),
    title: post.title || '',
    body: post.body || '',
    category: post.category || 'Update',
    postType: post.postType || post.post_type || 'update',
    eventDate: post.eventDate || post.event_date || '',
    deadlineDate: post.deadlineDate || post.deadline_date || '',
    authorUserId: post.authorUserId || post.author_user_id || '',
    authorName: post.authorName || post.author_name || 'UJLP',
    authorPhotoKey: post.authorPhotoKey || post.author_photo_key || 'blank',
    pinned: Boolean(post.pinned),
    tags: normalizeTextArray(post.tags),
    createdAt: post.createdAt || post.created_at || new Date().toISOString()
});

const normalizeFeedComment = (comment) => ({
    id: comment.id || createId('comment'),
    postId: comment.postId || comment.post_id || '',
    authorUserId: comment.authorUserId || comment.author_user_id || '',
    authorName: comment.authorName || comment.author_name || 'UJLP member',
    authorPhotoKey: comment.authorPhotoKey || comment.author_photo_key || 'blank',
    body: comment.body || '',
    createdAt: comment.createdAt || comment.created_at || new Date().toISOString()
});

const normalizeFeedLike = (like) => ({
    id: like.id || `${like.postId || like.post_id || ''}-${like.userId || like.user_id || ''}`,
    postId: like.postId || like.post_id || '',
    userId: like.userId || like.user_id || '',
    userName: like.userName || like.user_name || 'UJLP member',
    userPhotoKey: like.userPhotoKey || like.user_photo_key || 'blank',
    createdAt: like.createdAt || like.created_at || new Date().toISOString()
});

const normalizeAnnouncement = (announcement) => ({
    id: announcement.id || createId('announcement'),
    title: announcement.title || '',
    body: announcement.body || announcement.content || '',
    category: announcement.category || 'Update',
    publishDate: announcement.publishDate || announcement.publish_date || announcement.date || '',
    audience: announcement.audience || 'public',
    taggedUserIds: normalizeTextArray(announcement.taggedUserIds || announcement.tagged_user_ids),
    authorUserId: announcement.authorUserId || announcement.author_user_id || '',
    authorName: announcement.authorName || announcement.author_name || '',
    authorPhotoKey: announcement.authorPhotoKey || announcement.author_photo_key || '',
    pinned: Boolean(announcement.pinned),
    createdAt: announcement.createdAt || announcement.created_at || new Date().toISOString()
});

const normalizeTask = (task) => ({
    id: task.id || createId('task'),
    title: task.title || '',
    details: task.details || '',
    role: task.role || 'Writers',
    dueDate: task.dueDate || task.due_date || '',
    priority: task.priority || 'medium',
    status: task.status || 'open',
    authorUserId: task.authorUserId || task.author_user_id || '',
    authorName: task.authorName || task.author_name || '',
    authorPhotoKey: task.authorPhotoKey || task.author_photo_key || '',
    createdAt: task.createdAt || task.created_at || new Date().toISOString()
});

const normalizeCalendarEvent = (event) => ({
    id: event.id || createId('calendar'),
    title: event.title || '',
    details: event.details || event.body || event.description || '',
    category: event.category || 'Event',
    eventDate: event.eventDate || event.event_date || '',
    startTime: event.startTime || event.start_time || '',
    endTime: event.endTime || event.end_time || '',
    location: event.location || '',
    linkUrl: event.linkUrl || event.link_url || '',
    pinned: Boolean(event.pinned),
    createdAt: event.createdAt || event.created_at || new Date().toISOString()
});

const toFeedPostRow = (post) => ({
    id: post.id?.startsWith('feed-') ? undefined : post.id,
    title: post.title,
    body: post.body,
    category: post.category,
    post_type: post.postType,
    event_date: post.eventDate || null,
    deadline_date: post.deadlineDate || null,
    author_user_id: post.authorUserId || null,
    author_name: post.authorName,
    author_photo_key: post.authorPhotoKey || 'blank',
    pinned: post.pinned,
    tags: post.tags || []
});

const toFeedCommentRow = (comment) => ({
    id: comment.id?.startsWith('comment-') ? undefined : comment.id,
    post_id: comment.postId,
    author_user_id: comment.authorUserId || null,
    author_name: comment.authorName,
    author_photo_key: comment.authorPhotoKey || 'blank',
    body: comment.body
});

const toFeedLikeRow = (like) => ({
    post_id: like.postId,
    user_id: like.userId,
    user_name: like.userName,
    user_photo_key: like.userPhotoKey || 'blank'
});

const toAnnouncementRow = (announcement) => ({
    id: announcement.id?.startsWith('announcement-') ? undefined : announcement.id,
    title: announcement.title,
    body: announcement.body,
    category: announcement.category,
    publish_date: announcement.publishDate || null,
    audience: announcement.audience || 'public',
    tagged_user_ids: announcement.taggedUserIds || [],
    pinned: announcement.pinned
});

const toTaskRow = (task) => ({
    id: task.id?.startsWith('task-') ? undefined : task.id,
    title: task.title,
    details: task.details,
    role: task.role,
    due_date: task.dueDate || null,
    priority: task.priority,
    status: task.status
});

const toCalendarEventRow = (event) => ({
    id: event.id?.startsWith('calendar-') ? undefined : event.id,
    title: event.title,
    details: event.details,
    category: event.category,
    event_date: event.eventDate || null,
    start_time: event.startTime || '',
    end_time: event.endTime || '',
    location: event.location || '',
    link_url: event.linkUrl || '',
    pinned: event.pinned
});

const localCollectionKey = {
    feedPosts: 'feedPosts',
    feedComments: 'feedComments',
    feedLikes: 'feedLikes',
    announcements: 'announcements',
    tasks: 'tasks',
    calendarEvents: 'calendarEvents'
};

export const fetchPortalContent = async (session) => {
    if (!isSupabaseConfigured) return readLocalPortalContent();

    try {
        const [feedPosts, announcements, tasks, calendarEvents] = await Promise.all([
            supabaseRequest('/rest/v1/alumni_feed_posts?select=*&order=pinned.desc,created_at.desc', { method: 'GET' }, session),
            supabaseRequest('/rest/v1/public_announcements?select=*&order=pinned.desc,publish_date.desc', { method: 'GET' }, session),
            supabaseRequest('/rest/v1/alumni_weekly_tasks?select=*&order=due_date.asc', { method: 'GET' }, session),
            supabaseRequest('/rest/v1/alumni_calendar_events?select=*&order=pinned.desc,event_date.asc,start_time.asc', { method: 'GET' }, session)
        ]);
        const [feedComments, feedLikes] = await Promise.all([
            supabaseRequest('/rest/v1/alumni_feed_comments?select=*&order=created_at.asc', { method: 'GET' }, session).catch(() => []),
            supabaseRequest('/rest/v1/alumni_feed_likes?select=*&order=created_at.asc', { method: 'GET' }, session).catch(() => [])
        ]);

        return {
            feedPosts: feedPosts.map(normalizeFeedPost),
            feedComments: feedComments.map(normalizeFeedComment),
            feedLikes: feedLikes.map(normalizeFeedLike),
            announcements: announcements.map(normalizeAnnouncement),
            tasks: tasks.map(normalizeTask),
            calendarEvents: calendarEvents.map(normalizeCalendarEvent)
        };
    } catch {
        return readLocalPortalContent();
    }
};

export const fetchPublicAnnouncements = async () => {
    if (!isSupabaseConfigured) return fallbackAnnouncements.map(normalizeAnnouncement);

    try {
        const rows = await supabaseRequest(
            '/rest/v1/public_announcements?select=*&audience=eq.public&order=pinned.desc,publish_date.desc',
            { method: 'GET' }
        );
        return rows.map(normalizeAnnouncement);
    } catch {
        return fallbackAnnouncements.map(normalizeAnnouncement);
    }
};

export const savePortalItem = async (collection, item, session) => {
    const normalized = {
        feedPosts: normalizeFeedPost,
        feedComments: normalizeFeedComment,
        feedLikes: normalizeFeedLike,
        announcements: normalizeAnnouncement,
        tasks: normalizeTask,
        calendarEvents: normalizeCalendarEvent
    }[collection](item);

    if (isSupabaseConfigured) {
        const config = {
            feedPosts: ['/rest/v1/alumni_feed_posts', toFeedPostRow],
            feedComments: ['/rest/v1/alumni_feed_comments', toFeedCommentRow],
            feedLikes: ['/rest/v1/alumni_feed_likes', toFeedLikeRow],
            announcements: ['/rest/v1/public_announcements', toAnnouncementRow],
            tasks: ['/rest/v1/alumni_weekly_tasks', toTaskRow],
            calendarEvents: ['/rest/v1/alumni_calendar_events', toCalendarEventRow]
        }[collection];
        const [path, toRow] = config;
        const row = toRow(normalized);
        Object.keys(row).forEach(key => row[key] === undefined && delete row[key]);
        const rows = await supabaseRequest(path, {
            method: 'POST',
            headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
            body: JSON.stringify(row)
        }, session);
        return {
            feedPosts: normalizeFeedPost,
            feedComments: normalizeFeedComment,
            feedLikes: normalizeFeedLike,
            announcements: normalizeAnnouncement,
            tasks: normalizeTask,
            calendarEvents: normalizeCalendarEvent
        }[collection](Array.isArray(rows) ? rows[0] : rows);
    }

    const content = readLocalPortalContent();
    const key = localCollectionKey[collection];
    content[key] = [normalized, ...content[key].filter(existing => existing.id !== normalized.id)];
    writeLocalPortalContent(content);
    return normalized;
};

export const deletePortalItem = async (collection, id, session) => {
    if (isSupabaseConfigured) {
        const table = {
            feedPosts: 'alumni_feed_posts',
            feedComments: 'alumni_feed_comments',
            feedLikes: 'alumni_feed_likes',
            announcements: 'public_announcements',
            tasks: 'alumni_weekly_tasks',
            calendarEvents: 'alumni_calendar_events'
        }[collection];
        const filter = collection === 'feedLikes' ? id : `id=eq.${id}`;
        await supabaseRequest(`/rest/v1/${table}?${filter}`, { method: 'DELETE' }, session);
        return;
    }

    const content = readLocalPortalContent();
    const key = localCollectionKey[collection];
    content[key] = content[key].filter(item => item.id !== id);
    writeLocalPortalContent(content);
};

export const toggleFeedLike = async (post, actor, liked, session) => {
    const like = normalizeFeedLike({
        postId: post.id,
        userId: actor.userId,
        userName: actor.name,
        userPhotoKey: actor.photoKey
    });

    if (isSupabaseConfigured) {
        if (liked) {
            await supabaseRequest(`/rest/v1/alumni_feed_likes?post_id=eq.${post.id}&user_id=eq.${actor.userId}`, { method: 'DELETE' }, session);
            return null;
        }

        const rows = await supabaseRequest('/rest/v1/alumni_feed_likes', {
            method: 'POST',
            headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
            body: JSON.stringify(toFeedLikeRow(like))
        }, session);
        return normalizeFeedLike(Array.isArray(rows) ? rows[0] : rows);
    }

    const content = readLocalPortalContent();
    const exists = content.feedLikes.some(item => item.postId === post.id && item.userId === actor.userId);
    content.feedLikes = exists
        ? content.feedLikes.filter(item => !(item.postId === post.id && item.userId === actor.userId))
        : [like, ...content.feedLikes];
    writeLocalPortalContent(content);
    return exists ? null : like;
};
