import fs from 'fs';
import path from 'path';

const statePath = path.resolve('src/data/password-state.json');

export function getCurrentPassword() {
    const data = JSON.parse(fs.readFileSync(statePath, 'utf-8'));
    return data.currentPassword;
}

export function updatePassword(newPassword) {
    const data = { currentPassword: newPassword };
    fs.writeFileSync(statePath, JSON.stringify(data, null, 2));
}
