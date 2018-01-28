import _ from "lodash";

import switchCase from "./switchCase";
import initialState from "./initialState";
import {action} from "../helpers";

export default switchCase(initialState.user, {
    [action.GET_USERS.REQUEST]: state => ({
        ...state,
        gettingUsers: true,
        gotUsers: false,
        getUsersFailure: false
    }),
    [action.GET_USERS.SUCCESS]: (state, action) => {
        return {
            ...state,
            gettingUsers: false,
            gotUsers: true,
            getUsersFailure: false,
            usersList: _.uniqBy(state.usersList.concat(action.serverResponse), "id")
        }
    },
    [action.GET_USERS.FAILURE]: state => ({
        ...state,
        gettingUsers: false,
        gotUsers: false,
        getUsersFailure: true
    }),
    [action.GET_FOLLOWERS.REQUEST]: (state, action) => {
        return {
            ...state,
            gettingFollowers: true,
            gotFollowers: false,
            getFollowersFailure: false,
            followersList: {
                ...state.followersList,
                [action.login]: state.followersList[action.login] ? state.followersList[action.login] : []
            }
        }
    },
    [action.GET_FOLLOWERS.SUCCESS]: (state, action) => {
        return {
            ...state,
            gettingFollowers: false,
            gotFollowers: true,
            getFollowersFailure: false,
            followersList: {
                ...state.followersList,
                [action.login]: _.uniqBy(state.followersList[action.login].concat(action.serverResponse), "id")
            }
        }
    },
    [action.GET_FOLLOWERS.FAILURE]: state => ({
        ...state,
        gettingFollowers: false,
        gotFollowers: false,
        getFollowersFailure: true
    }),
});
