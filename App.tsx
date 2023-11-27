/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {getTTS} from './google-translate/tts';
import {getTextTranslations} from './google-translate/ttt';
import {play} from './audioPlayer/play';

import RealmProvider from './components/app/RealmProvider';
import {NavigationContainer} from '@react-navigation/native';
import SaveTranslation from './screens/SaveTranslation';
import ReadTranslations from './screens/ReadTranslations';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    (async () => {
      const sl = 'en';
      const tl = 'zh-CN';
      const st = 'I want to eat food soon';

      const {tt, tr} = await getTextTranslations({
        sl,
        tl,
        st,
        id: 1,
      });
      console.log(tt);
      console.log(tr);
      const audio64 = await getTTS(tl, tt, 1);
      console.log(audio64);
      play(audio64);
    })();
  }, []);

  return (
    // TODO: Complete Navigation -> https://reactnavigation.org/docs/hello-react-navigation
    <NavigationContainer>
      <RealmProvider>
        <SafeAreaView style={backgroundStyle}>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={backgroundStyle}>
            <SaveTranslation />
            <ReadTranslations />
          </ScrollView>
        </SafeAreaView>
      </RealmProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
