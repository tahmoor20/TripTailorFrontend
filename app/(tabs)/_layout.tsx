import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#636AE8FF',
                tabBarInactiveTintColor: '#6E6E6E',
                tabBarStyle: {
                    backgroundColor: '#F8F8F8',
                    borderTopWidth: 0,
                    elevation: 5,
                    position: 'absolute',
                    height: 65,
                    paddingBottom: 0,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? 'home-sharp' : 'home-outline'}
                            color={color}
                            size={28}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: 'Explore',
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? 'earth' : 'earth-outline'}
                            color={color}
                            size={28}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="accountSettings"
                options={{
                    title: 'Account',
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? 'person' : 'person-outline'}
                            color={color}
                            size={28}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    headerShown: false,
                    href: null,
                }}
            />
            <Tabs.Screen
                name="itinerary"
                options={{
                    headerShown: false,
                    href: null,
                }}
            />
            <Tabs.Screen
                name="homecitydetails"
                options={{
                    headerShown: false,
                    href: null,
                }}
            />
        </Tabs>
    );
}