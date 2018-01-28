import {action, c} from "../helpers";

export function getUsers(startNumber) {
    const url  = `${c.URL}/users?per_page=${c.SHOW_USERS_PER_PAGE}&since=${startNumber}`;

    return ({type: action.GET_USERS, url});
}

export function getFollowers({user, page}) {
    const url  = `${c.URL}/users/${user}/followers?per_page=${c.SHOW_USERS_PER_PAGE}&page=${page}`;

    return ({type: action.GET_FOLLOWERS, url, login: user});
}
