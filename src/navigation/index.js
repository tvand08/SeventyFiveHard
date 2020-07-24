import React, {useLayoutEffect, useRef, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {
  createAppContainer,
  createSwitchNavigator,
  SafeAreaView,
} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import DeviceInfo from 'react-native-device-info';
import {createStackNavigator} from 'react-navigation-stack';
import {Water} from '../screens';
import {Workout} from '../screens/workout';

const CustomTabBar = (props) => {
  const {navigationState, navigation, position} = props;
  const Container = styled.View`
    padding: 10px 0;
    background-color: transparent;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    border-top-width: 1px;
    border-top-color: #dae8f8;
  `;

  let InitialRoute; // TODO: Why doesn't useState work here? Too many re-render
  const firstUpdate = useRef(true);
  const [activeTab, setActiveTab] = useState([]);

  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      let tabArray = Object.keys(TABS);
      if (navigation.state.index <= tabArray.indexOf(InitialRoute)) {
        navigation.navigate(InitialRoute);
        setActiveTab(InitialRoute);
      } else {
        setActiveTab(TABS[tabArray[navigation.state.index]]);
      }
      return;
    }
  }, []);
  return (
    <SafeAreaView forceInset={{bottom: 'always', top: 'never'}}>
      <Container>
        {navigation.state.routes
          // List of permission filters
          .filter((item) =>
            user.Permissions.FamilyPermissions.TrackAttendance
              ? true
              : item.routeName !== 'Attendance',
          )
          .filter((item) =>
            user.Permissions.FamilyPermissions.ActivityLogs
              ? true
              : item.routeName !== 'Activities',
          )
          .filter((item) =>
            user.Permissions.FamilyPermissions.Child && !isTablet
              ? true
              : item.routeName !== 'Child List',
          )
          .filter((item) =>
            user.Permissions.MessagingPermissions.MessagingEnabled
              ? true
              : item.routeName !== 'Messages',
          )
          .map((route, index) => {
            let color;
            const iconName = TABBAR_ICONS[route.routeName];
            if (index == 1) {
              // TODO: Set starting icon based on user.Permissions.Activities
              InitialRoute = route.routeName;
            }
            if (activeTab == route.routeName) {
              color = theme.colors.main[0];
            }
            if (activeTab !== route.routeName) {
              color = theme.colors.text.light;
            }
            return (
              <TouchableOpacity
                onPress={() => {
                  Analytics.trackEvent('Changed Section', {
                    SectionName: route.routeName,
                    UserId: user.UserId,
                    TenantId: user.Tenant.TenantId,
                  });
                  navigation.navigate(route.routeName);
                  setActiveTab(route.routeName);
                }}
                key={index}
                style={{alignItems: 'center'}}>
                <TabIcon name={iconName} size={16} color={color} />
                <BoldText style={{color: color, marginTop: 5, fontSize: 12}}>
                  {route.routeName}
                </BoldText>
              </TouchableOpacity>
            );
          })}
      </Container>
    </SafeAreaView>
  );
};

const TabNavigator = createBottomTabNavigator(
  {
    Activities: {
      screen: Water(),
    },
    Messages: {
      screen: Workout(),
    },
  },
  {
    tabBarComponent: CustomTabBar,
  },
);

export const Navigation = createAppContainer(
  createSwitchNavigator(
    {
      Auth: AuthStack,
      App: TabNavigator,
      Onboarding: UserOnboardingStack,
      Settings: UserSettings,
    },
    {
      initialRouteName: 'Auth',
    },
  ),
);
