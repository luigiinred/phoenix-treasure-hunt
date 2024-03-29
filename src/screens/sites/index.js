import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  TouchableHighlight,
  FlatList,
  RefreshControl,
  Platform
} from "react-native";
import {
  Row,
  Column,
  ListItem,
  ListTitle,
  ListSubtitle,
  Divider
} from "../../components";
import { connect } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react";
import { compose } from "redux";
import globalStyles from "../../styles";
import StarRating from "react-native-star-rating";

class ListSites extends Component {
  static navigatorStyle = Platform.OS === "ios"
    ? {}
    : {
        navBarBackgroundColor: globalStyles.colors.primary,
        navBarTextColor: "#FFFFFF",
        navBarButtonColor: "#FFFFFF",
        statusBarColor: globalStyles.colors.primaryDark,
        navBarTranslucent: false
      };

  constructor(props) {
    super(props);

    this.props.fetchSites();
    this.props.fetchAnswers();
  }

  onForward = site => {
    this.props.navigator.push({
      screen: "phoenixtreasurehunt.ShowSiteScreen",
      passProps: {
        site
      },
      title: site.name
    });
  };

  render() {
    const { sites } = this.props;

    const append = val => () => this.append(val);
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              this.props.fetchSites();
            }}
          />
        }
      >
        {(sites.data || []).map(item => (
          <TouchableHighlight
            key={item.number}
            onPress={item.checkedIn ? () => this.onForward(item) : null}
          >
            <ListItem style={{ paddingLeft: 24, flex: 1 }}>
              <Column>
                <ListSubtitle>Site {item.number}</ListSubtitle>
                <ListTitle>{item.checkedIn ? item.name : "???"}</ListTitle>
                {item.checkedIn &&
                  (item.rating ? (
                    <View style={{ width: 120 }}>
                      <StarRating
                        starSize={18}
                        disabled={true}
                        maxStars={5}
                        rating={item.rating}
                      />
                    </View>
                  ) : (
                    <Text>Not Rated.</Text>
                  ))}
              </Column>
            </ListItem>
          </TouchableHighlight>
        ))}
      </ScrollView>
    );
  }
}

function mapStateToProps(state) {
  return {
    sites: state.sites
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchSites: async data => {
      dispatch({ type: "FETCH_SITES" });
    },
    fetchAnswers: async data => {
      dispatch({ type: "FETCH_ANSWERS" });
    },
    logout: async data => {
      dispatch({ type: "LOGOUT_AUTH", data });
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListSites);
