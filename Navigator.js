import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import MainScreen from './screens/MainScreen';
import InfoScreen from './screens/InfoScreen';

const appInfoNavigator = createStackNavigator({
    main: { screen: MainScreen},
    info: { screen: InfoScreen}
},
    {
        defaultNavigationOptions: {
            headerShown: false
        }
    });

export default createAppContainer(appInfoNavigator);