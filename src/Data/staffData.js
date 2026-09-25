import blankPortrait from '../ProfilePictures/ComingSoon.jpg';

// New staff profiles share the existing layout until bios and portraits are supplied.
export const newStaffMembers = [
    {
        "id": "casey-pita",
        "name": "Casey Pita",
        "role": "Executive Editor",
        "types": [
            "executive-editor"
        ]
    },
    {
        "id": "alexis-chen",
        "name": "Alexis Chen",
        "role": "Internal Writer",
        "types": [
            "internal-writer"
        ]
    },
    {
        "id": "ryan-arsenault",
        "name": "Ryan Arsenault",
        "role": "Internal Writer",
        "types": [
            "internal-writer"
        ]
    },
    {
        "id": "nadia-hassen",
        "name": "Nadia Hassen",
        "role": "Internal Writer",
        "types": [
            "internal-writer"
        ]
    },
    {
        "id": "amy-cherlan",
        "name": "Amy Cherlan",
        "role": "Internal Writer",
        "types": [
            "internal-writer"
        ]
    },
    {
        "id": "pauline-tsui",
        "name": "Pauline Tsui",
        "role": "Internal Writer",
        "types": [
            "internal-writer"
        ]
    },
    {
        "id": "caroline-south",
        "name": "Caroline South",
        "role": "Internal Writer",
        "types": [
            "internal-writer"
        ]
    },
    {
        "id": "meridith-bradley",
        "name": "Meridith Bradley",
        "role": "Internal Writer",
        "types": [
            "internal-writer"
        ]
    },
    {
        "id": "neelesh-gupta",
        "name": "Neelesh Gupta",
        "role": "Internal Writer",
        "types": [
            "internal-writer"
        ]
    },
    {
        "id": "rylie-reid",
        "name": "Rylie Reid",
        "role": "Staff Editor",
        "types": [
            "staff-editor"
        ]
    },
    {
        "id": "ava-ross",
        "name": "Ava Ross",
        "role": "Staff Editor",
        "types": [
            "staff-editor"
        ]
    },
    {
        "id": "max-levy",
        "name": "Max Levy",
        "role": "Staff Editor",
        "types": [
            "staff-editor"
        ]
    },
    {
        "id": "meilhi-leon-terceros",
        "name": "Meilhi Leon Terceros",
        "role": "Staff Editor",
        "types": [
            "staff-editor"
        ]
    },
    {
        "id": "matthew-len",
        "name": "Matthew Len",
        "role": "Staff Editor",
        "types": [
            "staff-editor"
        ]
    },
    {
        "id": "monica-sarkisian",
        "name": "Monica Sarkisian",
        "role": "Staff Editor",
        "types": [
            "staff-editor"
        ]
    },
    {
        "id": "beauford-matthews",
        "name": "Beauford Matthews",
        "role": "Staff Editor",
        "types": [
            "staff-editor"
        ]
    },
    {
        "id": "aayush-tenudlkar",
        "name": "Aayush Tenudlkar",
        "role": "Staff Editor",
        "types": [
            "staff-editor"
        ]
    },
    {
        "id": "ava-wilkins",
        "name": "Ava Wilkins",
        "role": "Staff Editor",
        "types": [
            "staff-editor"
        ]
    },
    {
        "id": "annabelle-bragdon",
        "name": "Annabelle Bragdon",
        "role": "Staff Editor",
        "types": [
            "staff-editor"
        ]
    },
    {
        "id": "yinou-zhang",
        "name": "Yinou Zhang",
        "role": "Staff Editor",
        "types": [
            "staff-editor"
        ]
    },
    {
        "id": "lindsey-dufault",
        "name": "Lindsey Dufault",
        "role": "Staff Editor",
        "types": [
            "staff-editor"
        ]
    },
    {
        "id": "catherine-ziegler",
        "name": "Catherine Ziegler",
        "role": "Staff Editor",
        "types": [
            "staff-editor"
        ]
    },
    {
        "id": "skylar-dalili",
        "name": "Skylar Dalili",
        "role": "Staff Editor",
        "types": [
            "staff-editor"
        ]
    },
    {
        "id": "mimi-reschly-krasowski",
        "name": "Mimi Reschly-Krasowski",
        "role": "Staff Editor",
        "types": [
            "staff-editor"
        ]
    },
    {
        "id": "eunbin-lee",
        "name": "Eunbin Lee",
        "role": "Staff Editor",
        "types": [
            "staff-editor"
        ]
    },
    {
        "id": "sherry-klen",
        "name": "Sherry Klen",
        "role": "Staff Editor",
        "types": [
            "staff-editor"
        ]
    },
    {
        "id": "sonvi-chawla",
        "name": "Sonvi Chawla",
        "role": "Staff Editor",
        "types": [
            "staff-editor"
        ]
    },
    {
        "id": "isabella-miller",
        "name": "Isabella Miller",
        "role": "Staff Editor",
        "types": [
            "staff-editor"
        ]
    },
    {
        "id": "ella-blakeley",
        "name": "Ella Blakeley",
        "role": "Staff Editor",
        "types": [
            "staff-editor"
        ]
    },
    {
        "id": "vick-volovnky",
        "name": "Vick Volovnky",
        "role": "Staff Editor",
        "types": [
            "staff-editor"
        ]
    },
    {
        "id": "ben-wood",
        "name": "Ben Wood",
        "role": "Staff Editor",
        "types": [
            "staff-editor"
        ]
    },
    {
        "id": "nina-galinsky",
        "name": "Nina Galinsky",
        "role": "Staff Editor",
        "types": [
            "staff-editor"
        ]
    }
].map(member => ({
    ...member,
    img: blankPortrait,
    link: `/author/${member.id}`,
}));
