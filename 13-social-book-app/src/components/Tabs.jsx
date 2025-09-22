import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const Tabs = ({ tabs, activeTab, onTabPress }) => (
  <View style={styles.tabsContainer}>
    {tabs.map(tab => (
      <TouchableOpacity
        key={tab.key}
        style={[styles.tab, activeTab === tab.key && styles.activeTab]}
        onPress={() => onTabPress(tab.key)}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === tab.key && styles.activeTabText,
          ]}
        >
          {tab.label}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    marginVertical: 12,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
  },
  activeTab: {
    backgroundColor: '#6366F1',
  },
  tabText: {
    color: '#6366F1',
    fontWeight: '600',
    fontSize: 16,
  },
  activeTabText: {
    color: '#FFF',
  },
});

export default Tabs;
