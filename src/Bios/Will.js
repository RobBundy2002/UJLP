import React from 'react';
import StaffProfile from './StaffProfile';
import { willStaffMember } from '../Data/staffData';

function Will() {
    return <StaffProfile member={willStaffMember} />;
}

export default Will;
