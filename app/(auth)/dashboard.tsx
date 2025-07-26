import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  Dimensions,
  FlatList,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import fetchDashboardData from '@/api/dashboard_api';

// Define the type for icon names
type IconName = React.ComponentProps<typeof Ionicons>['name'];
// Define inspection types
const inspectionTypes = [
  { id: 1, name: 'Residential Inspection', icon: 'home-outline' as IconName },
  { id: 2, name: 'Commercial Inspection', icon: 'business-outline' as IconName },
  { id: 3, name: 'Rental Property Inspection', icon: 'key-outline' as IconName },
  { id: 4, name: 'Pre-Purchase Inspection', icon: 'cart-outline' as IconName },
  { id: 5, name: 'Insurance Inspection', icon: 'shield-outline' as IconName },
  { id: 6, name: 'Maintenance Inspection', icon: 'construct-outline' as IconName },
  { id: 7, name: 'Inspection Schedule', icon: 'home-outline' as IconName },
];

// Mock inspection data organized by date
const mockInspections = [
  {
    id: '1',
    date: new Date().toISOString().split('T')[0],
    inspections: [
      { id: '101', type: 1, address: '123 Main St', status: 'Completed', time: '09:30 AM' },
      { id: '102', type: 3, address: '456 Oak Ave', status: 'Pending', time: '02:00 PM' },
    ]
  },
  {
    id: '2',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    inspections: [
      { id: '103', type: 2, address: '789 Business Park', status: 'Completed', time: '10:15 AM' },
    ]
  },
  {
    id: '3',
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    inspections: [
      { id: '104', type: 5, address: '321 Pine Rd', status: 'Completed', time: '11:00 AM' },
      { id: '105', type: 4, address: '654 Maple Dr', status: 'Cancelled', time: '03:30 PM' },
      { id: '106', type: 6, address: '987 Cedar Ln', status: 'Completed', time: '05:00 PM' },
    ]
  },
  {
    id: '4',
    date: new Date(Date.now() - 259200000).toISOString().split('T')[0],
    inspections: [
      { id: '107', type: 1, address: '159 Elm St', status: 'Completed', time: '09:00 AM' },
      { id: '108', type: 3, address: '753 Birch Ave', status: 'Completed', time: '01:45 PM' },
    ]
  },
];

// Helper function to format dates
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Helper function to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed': return '#28a745';
    case 'Pending': return '#ffc107';
    case 'Cancelled': return '#dc3545';
    default: return '#6c757d';
  }
};

export default function DashboardScreen() {
  const router = useRouter();
  const [selectedInspection, setSelectedInspection] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [myDates, setMyDates] = useState<string[]>([]);
  const [formNames, setFormNames] = useState<string[]>([]);
  const [status, setStatus] = useState<string[]>([]);

  useEffect(() => {
    fetchDashboardData().then((items: any) => {
      // Expecting items.items to be an array of objects with creationDate and formName
      if (Array.isArray(items.items)) {
        setMyDates(items.items.map((item: any) => item.creationDate));
        setFormNames(items.items.map((item: any) => item.formName || ''));
        setStatus(items.items.map((item: any) => item.status || null))  ;
      } else if (items.creationDate) {
        setMyDates([items.creationDate]);
        setFormNames([items.formName || '']);
        setStatus([items.status || null]);
      } else {
        setMyDates([]);
        setFormNames([]);
      }
    });
  }, []);
  console.log('\n\nDashboard API Dat:', myDates);  ///////////////////////////////////
  console.log('\n\nDashboard API FormNames:', formNames);  ///////////////////////////////////
  console.log('\n\nDashboard API Status:', status);  ///////////////////////////////////

  const handleInspectionSelect = (id: number) => {
    setSelectedInspection(id);
    setShowSidebar(false); // Hide sidebar on mobile after selection

  };

  const handleNewInspection = () => {
    if (selectedInspection) {
      const typeName = inspectionTypes.find(t => t.id === selectedInspection)?.name || 'Inspection';
      router.push({
        pathname: '/(auth)/application-form',
        params: {
          inspectionType: selectedInspection,
          inspectionName: typeName
        }
      });
    }
  };

  const handleInspectionDetails = (inspection: any) => {
    const inspectionType = inspectionTypes.find(t => t.id === inspection.type);
    if (!inspectionType) return;

    const inspectionName = inspectionType.name || 'Inspection';

    // Sample data for inspections
    const sampleData = {
      applicationDetails: {
        applicationId: inspection.id,
        propertyAddress: inspection.address,
        inspectionDate: inspection.date,
        inspectionTime: inspection.time,
        inspectionType: inspectionName,
        contactName: 'John Doe',
        contactPhone: '0412 345 678',
        contactEmail: 'john.doe@example.com',
      },
      // Only include inspection details if the status is 'Completed'
      inspectionDetails: inspection.status === 'Completed' ? {
        generalQuestions: {
          question1: 'Yes',
          question2: 'No',
          question3: 'Yes',
          question4: 'Sample answer for generic question 4',
        },
        propertyDetails: {
          propertyType: 'Residential',
          yearBuilt: '2010',
          numberOfBedrooms: '3',
          numberOfBathrooms: '2',
          propertySize: '250',
        },
        inspectionNotes: 'All items inspected and passed',
        recommendations: 'Regular maintenance required',
        photos: [],
      } : null
    };

    router.push({
      pathname: '/(auth)/application-form',
      params: {
        inspectionType: inspection.type,
        inspectionName,
        isViewing: inspection.status === 'Completed' ? 'true' : 'false',
        inspectionData: JSON.stringify(sampleData),
        status: inspection.status
      }
    });
  };

  const handleSignOut = () => {
    router.replace('/(auth)/sign-in');
  };

  // Filter inspections by selected date and type
  const filteredInspections = selectedDate
    ? mockInspections.find(item => item.date === selectedDate)?.inspections.filter(
      inspection => !selectedInspection || inspection.type === selectedInspection
    ) || []
    : [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setShowSidebar(!showSidebar)}
        >
          <Ionicons name="menu" size={24} color="#333" />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/Logo.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.headerTitle}>Shire of Irwin</Text>

        <TouchableOpacity
          style={styles.signOutButton}
          onPress={() => {
            Alert.alert(
              'Sign Out',
              'Are you sure you want to sign out?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Sign Out', onPress: handleSignOut }
              ]
            );
          }}
        >
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
      {/* Show all API dates below header for debug */}

      {/* Debug: Show API Dates and formNames arrays visually */}
      {myDates.length > 0 && (
        <View style={{alignItems: 'center', marginVertical: 4}}>
          <Text style={{fontSize: 15, color: '#007AFF', fontWeight: 'bold'}}>
            api dates:
          </Text>
          <Text style={{fontSize: 15, color: '#007AFF'}}>
            {myDates.map((d, i) => `${i + 1}: ${d}`).join(' | ')}
          </Text>
        </View>
      )}
      {formNames.length > 0 && (
        <View style={{alignItems: 'center', marginVertical: 4}}>
          <Text style={{fontSize: 15, color: '#FF9500'}}>
            {`formNames: [${formNames.join(', ')}]`}
          </Text>
        </View>
      )}

// ...existing code...


      <View style={styles.content}>
        {/* Sidebar with inspection types */}
        <View style={[
          styles.sidebar,
          showSidebar && styles.sidebarVisible
        ]}>
          <Text style={styles.sidebarTitle}>Inspection Types</Text>
          <ScrollView style={styles.inspectionList}>
            {inspectionTypes.map((type) => (
              console.log('Inspection Typewwwwwwwwwwwwwwwwwww:', formNames[0]), // Debug log
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.inspectionItem,
                  selectedInspection === type.id && styles.selectedInspection
                ]}
                // onPress={() => handleInspectionSelect(type.id)}
                onPress={() => {
                  if (type.name === 'Inspection Schedule') {
                    router.push({
                      pathname: '/(auth)/inspectionSchedule',
                      params: { id: '307' }
                    });
                  } else {
                    handleInspectionSelect(type.id);
                  }
                }}
              >
                <Ionicons name={type.icon} size={24} color={selectedInspection === type.id ? "#fff" : "#333"} />
                <Text style={[
                  styles.inspectionText,
                  selectedInspection === type.id && styles.selectedInspectionText
                ]}>
                  {type.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Main content area */}
        <View style={styles.mainContent}>
          {selectedInspection ? (
            <View style={styles.selectedInspectionHeader}>
              <View style={styles.selectedInspectionInfo}>
                <Ionicons
                  name={inspectionTypes.find(t => t.id === selectedInspection)?.icon || 'document-outline'}
                  size={24}
                  color="#007AFF"
                />
                <Text style={styles.selectedInspectionTitle}>
                  {inspectionTypes.find(t => t.id === selectedInspection)?.name}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.newInspectionButton}
                onPress={handleNewInspection}
              >
                <Text style={styles.newInspectionButtonText}>+

                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.welcomeText}>
              Select a date to begin
            </Text>
          )}

          <View style={styles.dashboardContent}>
            {/* Date selector */}
            <View style={styles.dateSelector}>
              <Text style={styles.dateSelectorTitle}>Inspection Dates</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.dateList}
                contentContainerStyle={styles.dateListContent}
              >
                {mockInspections.map((item, idx) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.dateItem,
                      selectedDate === item.date && styles.selectedDate
                    ]}
                    onPress={() => setSelectedDate(item.date)}
                  >
                    <Text style={[ 
                      styles.dateText,
                      selectedDate === item.date && styles.selectedDateText
                    ]}>
                      {myDates[idx] ? formatDate(myDates[idx]) : formatDate(item.date)}
                    </Text>
                    <Text style={[ 
                      styles.inspectionCount,
                      selectedDate === item.date && styles.selectedDateText
                    ]}>
                      {item.inspections.length} inspection{item.inspections.length !== 1 ? 's' : ''}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Inspections list */}
            {selectedDate ? (
              <View style={styles.inspectionsList}>
                <View style={styles.inspectionsHeader}>
                  <Text style={styles.inspectionsHeaderText}>
                    Inspections for {formatDate(selectedDate)}
                  </Text> 
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => setSelectedDate(null)}
                  >
                    <Text style={styles.clearButtonText}>Clear Selection</Text>
                  </TouchableOpacity>
                </View>

                {filteredInspections.length > 0 ? (
                  <FlatList
                    data={filteredInspections}
                    keyExtractor={(item, idx) => item.id + '-' + idx}
                    renderItem={({ item, index }) => {
                      // Show the form name as a big heading inside the card, remove the date
                      const formName = formNames[index];
                      return (
                        <TouchableOpacity
                          style={styles.inspectionCard}
                          onPress={() => handleInspectionDetails(item)}
                        >
                          {formName && (
                            <Text style={{fontSize: 20, color: '#007AFF', textAlign: 'left', fontWeight: 'bold', marginBottom: 8}}>
                              {formName}
                            </Text>
                          )}
                          <Text style={styles.inspectionTime}>{item.time || ''}</Text>
                        </TouchableOpacity>
                      );
                    }}
                    contentContainerStyle={styles.inspectionsListContent}
                  />
                ) : (
                  <Text style={styles.noInspectionsText}>
                    No inspections found for this date
                  </Text>
                )}
              </View>
            ) : (
              <Text style={styles.selectDateText}>
                Select a date to view inspections
              </Text>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  menuButton: {
    padding: 8,
  },
  logoContainer: {
    width: 40,
    height: 40,
    marginHorizontal: 8,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  signOutButton: {
    padding: 8,
  },
  signOutButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: Platform.OS === 'web' ? 250 : 0,
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
    position: Platform.OS === 'web' ? 'relative' : 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 1000,
    transform: [{ translateX: Platform.OS === 'web' ? 0 : -250 }],
  },
  sidebarVisible: {
    transform: [{ translateX: 0 }],
    width: 250,
  },
  sidebarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 16,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  inspectionList: {
    flex: 1,
  },
  inspectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedInspection: {
    backgroundColor: '#007AFF',
  },
  inspectionText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  selectedInspectionText: {
    color: '#fff',
  },
  mainContent: {
    flex: 1,
    padding: 16,
  },
  selectedInspectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  selectedInspectionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedInspectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  newInspectionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  newInspectionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  dashboardContent: {
    flex: 1,
  },
  dateSelector: {
    marginBottom: 16,
  },
  dateSelectorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  dateList: {
    flexGrow: 1,
  },
  dateListContent: {
    paddingRight: 16,
  },
  dateItem: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedDate: {
    backgroundColor: '#007AFF',
  },
  dateText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  selectedDateText: {
    color: '#fff',
  },
  inspectionCount: {
    fontSize: 12,
    color: '#666',
  },
  inspectionsList: {
    flex: 1,
  },
  inspectionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  inspectionsHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    color: '#007AFF',
    fontSize: 14,
  },
  inspectionsListContent: {
    paddingBottom: 16,
  },
  inspectionCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inspectionCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inspectionCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  inspectionAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  inspectionTime: {
    fontSize: 12,
    color: '#999',
  },
  noInspectionsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 32,
  },
  selectDateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 32,
  },
}); 