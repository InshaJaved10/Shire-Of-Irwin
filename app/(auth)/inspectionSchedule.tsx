import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function InspectionSchedule() {
  const { id } = useLocalSearchParams();
  console.log('Received ID from params:', id);
  const [inspection, setInspection] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchInspectionDetails = async () => {
    try {
      const response = await fetch(`https://oic-vbcs-oic-vb-axetemueuybx.builder.me-dubai-1.ocp.oraclecloud.com:443/ic/builder/design/LGCSA_BackOffice_Dev/1.0/resources/data/InspectionSchedule/307?fields=formID,formName,inspectorName,status,comments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'b2ljX2ludGVncmF0aW9uOkxTQ1VzZXJAMTIzNQ=='
          // Optional: Add Authorization if needed
        }
      });
      console.log('STATUS:', response.status);
      const data = await response.json();
      console.log('DATA:', data);
      setInspection(data);
    } catch (error) {
      console.error('Error fetching inspection:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchInspectionDetails();
    }
  }, [id]);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} color="#fff" size="large" />;
  }

  if (!inspection) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No inspection found with ID: {id}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
  <Text style={styles.title}>Inspection Details (ID: 307)</Text>
  <Text style={styles.label}>Form ID: <Text style={styles.value}>{inspection.formID}</Text></Text>
  <Text style={styles.label}>Form Name: <Text style={styles.value}>{inspection.formName}</Text></Text>
  <Text style={styles.label}>Inspector: <Text style={styles.value}>{inspection.inspectorName}</Text></Text>
  <Text style={styles.label}>Status: <Text style={styles.value}>{inspection.status ?? 'N/A'}</Text></Text>
  <Text style={styles.label}>Comments: <Text style={styles.value}>{inspection.comments}</Text></Text>
</View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 10,
  },
  value: {
    color: '#fff',
    fontWeight: '600',
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 40,
  },
});
