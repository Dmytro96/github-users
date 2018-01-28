import React, {PureComponent} from "react";
import {TouchableOpacity, StyleSheet, SafeAreaView, View, Text, ActivityIndicator, FlatList, Image} from "react-native";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {getUsers, getFollowers} from "../action/user.action";

import {c} from "../helpers";

class UsersList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            ownersFollowers: [],
            currentOwnerFollowers: false
        };

        this.configUserInfo = [
            {
                title: "Login",
                field: "login"
            },
            {
                title: "Url",
                field: "html_url"
            }
        ];
    }

    componentDidMount() {
        this.props.getUsers(0);
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.ownersFollowers !== this.state.ownersFollowers) {
            this.setState({currentOwnerFollowers: nextState.ownersFollowers.length !== 0 ?
                nextState.ownersFollowers[nextState.ownersFollowers.length - 1] :
                false
            });
        }
    }

    _keyExtractor = item => item.id;

    _onEndReached = () => {
        if (this.state.currentOwnerFollowers) {
            !this.props.gettingFollowers && this.getFollowersByUser(this.state.currentOwnerFollowers);
        } else {
            !this.props.gettingUsers && this.props.getUsers(this.props.usersList[this.props.usersList.length - 1].id);
        }
    };

    openFollowersList = user => {
        this.setState((prevState, props) => ({
            ownersFollowers: prevState.ownersFollowers.concat(user)
        }));

        this.getFollowersByUser(user);
    };

    getFollowersByUser = user => {
        const
            followersList = this.props.followersList[user.login],
            nextPage = followersList ? Math.floor(followersList.length / c.SHOW_USERS_PER_PAGE) : 0;

        this.props.getFollowers({user: user.login, page: nextPage + 1});
    };

    removeCurrentOwner = () => {
        this.setState((prevState, props) => ({
            ownersFollowers: prevState.ownersFollowers.slice(0, prevState.ownersFollowers.length - 1)
        }));
    };

    render() {
        const
            {followersList, usersList} = this.props,
            {currentOwnerFollowers} = this.state,
            currentData = currentOwnerFollowers ? followersList[currentOwnerFollowers.login] : usersList;

        return <SafeAreaView>
            <FlatList
                keyExtractor={this._keyExtractor}
                data={currentData}
                renderItem={({item}) => {
                    return <View style={style.container}>
                        <TouchableOpacity
                            onPress={() => {this.openFollowersList(item)}}
                            activeOpacity={0.7}
                        >
                            <Image
                                source={{uri: item.avatar_url}}
                                resizeMode="contain"
                                style={style.imageStyle}
                            />
                        </TouchableOpacity>

                        <View style={style.infoWrapper}>
                        {
                            this.configUserInfo.map(field => (
                                <View key={field.field} style={style.infoContainer}>
                                    <Text style={style.infoTitle}>
                                        {field.title}
                                    </Text>
                                    <Text style={style.infoField}>
                                        {item[field.field]}
                                    </Text>
                                </View>
                            ))
                        }
                        </View>
                    </View>
                }}
                ItemSeparatorComponent={() => <View style={style.separator}/>}
                onEndReached={this._onEndReached}
                ListHeaderComponent={() => {
                    if (currentOwnerFollowers) {
                        return <View style={style.headerContainer}>
                            <TouchableOpacity onPress={this.removeCurrentOwner}>
                                <Text style={style.backText}>
                                    Back to previous list
                                </Text>
                            </TouchableOpacity>
                            <Image
                                source={{uri: currentOwnerFollowers.avatar_url}}
                                resizeMode="contain"
                                style={style.imageStyle}
                            />
                        </View>
                    }

                    return false
                }}
                ListFooterComponent={() => (this.props.gettingUsers || this.props.gettingFollowers) &&
                    <ActivityIndicator size={"large"} style={style.loader}/>
                }

            />
        </SafeAreaView>
    }
}

const mapStateToProps = ({user}) => ({
    gettingUsers: user.gettingUsers,
    gotUsers: user.gotUsers,
    getUsersFailure: user.getUsersFailure,
    usersList: user.usersList,
    followersList: user.followersList,
    gettingFollowers: user.gettingFollowers,
    gotFollowers: user.gotFollowers,
    getFollowersFailure: user.getFollowersFailure
});

const mapDispatchToProps = dispatch => bindActionCreators({
    getUsers, getFollowers
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UsersList);

const style = StyleSheet.create({
    separator: {
        borderTopWidth: 1,
        borderTopColor: "#ccc"
    },
    container: {
        flexDirection: "row",
        padding: 10
    },
    imageStyle: {
        width: 100,
        height: 100,
        borderRadius: 50
    },
    infoWrapper: {
        flex: 1
    },
    infoContainer: {
        flexDirection: "row",
        marginBottom: 5
    },
    infoTitle: {
        fontWeight: "bold",
        flex: 0.2,
        paddingRight: 10,
        textAlign: "right"
    },
    infoField: {
        flex: 0.8
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 20
    },
    backText: {
        fontSize: 20,
        alignItems: "center",
        justifyContent: "center"
    },
    loader: {
        margin: 20
    }
});