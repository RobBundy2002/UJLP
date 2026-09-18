import blankPortrait from '../ProfilePictures/ComingSoon.jpg';
import derekImg from '../ProfilePictures/Derek.png';
import shelbyImg from '../ProfilePictures/Shelby.jpeg';
import robImg from '../ProfilePictures/Rob.jpg';
import evanImg from '../ProfilePictures/Evan.jpeg';
import richardImg from '../ProfilePictures/Richard.jpg';
import willImg from '../ProfilePictures/Will.jpg';
import rishiImg from '../ProfilePictures/Rishi.jpg';
import miaImg from '../ProfilePictures/Mia.jpg';
import charlieImg from '../ProfilePictures/Charlie.jpeg';
import rhettImg from '../ProfilePictures/Rhett.jpg';
import samImg from '../ProfilePictures/Sam.png';

export const alumniPhotoRegistry = {
    blank: {
        label: 'No photo',
        src: blankPortrait
    },
    'derek-tsai': {
        label: 'Derek Tsai',
        src: derekImg
    },
    'shelby-eliasek': {
        label: 'Shelby Eliasek',
        src: shelbyImg
    },
    'rob-bundy': {
        label: 'Rob Bundy',
        src: robImg
    },
    'evan-proudkii': {
        label: 'Evan Proudkii',
        src: evanImg
    },
    'richard-xu': {
        label: 'Richard Xu',
        src: richardImg
    },
    'will-olszewski': {
        label: 'Will Olszewski',
        src: willImg
    },
    'rishi-chandra': {
        label: 'Rishi Chandra',
        src: rishiImg
    },
    'mia-petersen': {
        label: 'Mia Petersen',
        src: miaImg
    },
    'charlie-houck': {
        label: 'Charlie Houck',
        src: charlieImg
    },
    'rhett-deitz': {
        label: 'Rhett Deitz',
        src: rhettImg
    },
    'sam-burnett': {
        label: 'Sam Burnett',
        src: samImg
    }
};

export const alumniPhotoOptions = Object.entries(alumniPhotoRegistry).map(([key, value]) => ({
    key,
    label: value.label
}));

export const getAlumniPhoto = (photoKey) => alumniPhotoRegistry[photoKey]?.src || alumniPhotoRegistry.blank.src;
