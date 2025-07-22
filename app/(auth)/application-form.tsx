import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
  Switch,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

// Mock storage for inspection data
const mockInspectionStorage = {
  saveInspection: async (data: any) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Inspection data saved:', data);
    return { success: true };
  }
};

// Mock storage for images
const mockImageStorage = {
  uploadImage: async (uri: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Image uploaded:', uri);
    // Return a fake URL
    return `https://mockserver.com/images/${Date.now()}.jpg`;
  }
};

interface ApplicationFormData {
  applicationId: string;
  firstName: string;
  lastName: string;
  contact: string;
  phone: string;
  location: string;
  isWashbasin: boolean;
  isRefrigerator: boolean;
  isGarage: boolean;
  pictureUrl: string;
  pictureComment: string;
  genericQuestion4: string;
}

export default function ApplicationFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const inspectionType = params.inspectionType ? Number(params.inspectionType) : null;
  const inspectionName = params.inspectionName as string || 'Inspection';
  const isViewing = params.isViewing === 'true';
  const inspectionData = params.inspectionData ? JSON.parse(params.inspectionData as string) : null;
  const status = params.status as string;
  const isPending = status === 'Pending';
  const isCompleted = status === 'Completed';
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<ApplicationFormData>({
    applicationId: inspectionData?.applicationDetails?.applicationId || '',
    firstName: inspectionData?.applicationDetails?.contactName?.split(' ')[0] || '',
    lastName: inspectionData?.applicationDetails?.contactName?.split(' ')[1] || '',
    contact: inspectionData?.applicationDetails?.contactEmail || '',
    phone: inspectionData?.applicationDetails?.contactPhone || '',
    location: inspectionData?.applicationDetails?.propertyAddress || '',
    isWashbasin: isCompleted ? inspectionData?.inspectionDetails?.generalQuestions?.question1 === 'Yes' : false,
    isRefrigerator: isCompleted ? inspectionData?.inspectionDetails?.generalQuestions?.question2 === 'Yes' : false,
    isGarage: isCompleted ? inspectionData?.inspectionDetails?.generalQuestions?.question3 === 'Yes' : false,
    pictureUrl: isCompleted ? inspectionData?.inspectionDetails?.photos?.[0] || '' : '',
    pictureComment: isCompleted ? inspectionData?.inspectionDetails?.inspectionNotes || '' : '',
    genericQuestion4: isCompleted ? inspectionData?.inspectionDetails?.generalQuestions?.question4 || '' : '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setFormData({
      applicationId: '',
      firstName: '',
      lastName: '',
      contact: '',
      phone: '',
      location: '',
      isWashbasin: false,
      isRefrigerator: false,
      isGarage: false,
      pictureUrl: '',
      pictureComment: '',
      genericQuestion4: '',
    });
    setImage(null);
    setErrors({});
    setSuccessMessage(`${inspectionName} submitted successfully! You can submit another inspection if needed.`);
    
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'You need to grant access to your photo library to upload images.');
      return;
    }

    try {
      // Clear the previous image before selecting a new one
      setImage(null);
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });

      if (!result.canceled) {
        console.log('New image selected');
        setImage(result.assets[0].uri);
      } else {
        console.log('Image selection cancelled');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const uploadImage = async () => {
    if (!image) return null;
    
    try {
      setUploadingImage(true);
      setLoadingMessage('Uploading image... This may take a moment.');
      
      // Use mock image storage
      const downloadURL = await mockImageStorage.uploadImage(image);
      
      setUploadingImage(false);
      setLoadingMessage(null);
      return downloadURL;
    } catch (error) {
      setUploadingImage(false);
      setLoadingMessage(null);
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleBack = () => {
    router.push('/(auth)/dashboard');
  };

  const validateField = (field: keyof ApplicationFormData, value: string) => {
    if (!value.trim()) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
    return '';
  };

  const handleFieldChange = (field: keyof ApplicationFormData, value: string) => {
    // Update form data
    setFormData({ ...formData, [field]: value });
    
    // Clear error when user types
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
    
    // Validate on blur or when field is empty
    if (!value.trim() && (field === 'applicationId' || field === 'firstName' || 
        field === 'lastName' || field === 'phone')) {
      setErrors({ 
        ...errors, 
        [field]: validateField(field, value)
      });
    }
  };

  const validateForm = () => {
    const requiredFields = [
      { field: 'applicationId', label: 'Inspection ID' },
      { field: 'firstName', label: 'First Name' },
      { field: 'lastName', label: 'Last Name' },
      { field: 'phone', label: 'Phone Number' },
      { field: 'location', label: 'Location' }
    ];
    
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    requiredFields.forEach(({ field, label }) => {
      const value = formData[field as keyof ApplicationFormData] as string;
      if (!value || !value.trim()) {
        newErrors[field] = `${label} is required`;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    
    if (!isValid) {
      const missingFieldLabels = requiredFields
        .filter(({ field }) => newErrors[field])
        .map(f => f.label)
        .join(', ');
        
      Alert.alert(
        'Required Fields Missing',
        `Please fill in the following required fields: ${missingFieldLabels}`,
        [{ text: 'OK' }]
      );
    }
    
    return isValid;
  };

  const handleSubmit = async () => {
    setSuccessMessage(null);
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      let pictureUrl = formData.pictureUrl;
      
      if (image) {
        setLoadingMessage('Uploading image and saving data...');
        pictureUrl = await uploadImage() || '';
      } else {
        setLoadingMessage('Saving inspection data...');
      }

      // Data to be saved
      const inspectionData = {
        ...formData,
        pictureUrl,
        inspectionType,
        inspectionName,
        createdAt: new Date().toISOString(),
      };
      
      console.log('Attempting to save inspection data:', inspectionData);
      
      // Save data using mock storage
      await mockInspectionStorage.saveInspection(inspectionData);
      
      console.log('Data saved successfully');
      setLoadingMessage(null);

      // Reset form after successful submission
      resetForm();

      // Show success alert
      Alert.alert(
        'Success',
        `${inspectionName} submitted successfully!`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Stay on the same page with reset form instead of navigating away
              console.log('Form has been reset');
            }
          },
        ]
      );
    } catch (error) {
      setLoadingMessage(null);
      console.error('Error submitting inspection:', error);
      
      // More detailed error handling
      let errorMessage = 'Failed to submit inspection. Please try again.';
      
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
      setLoadingMessage(null);
    }
  };

  const removeImage = () => {
    setImage(null);
    setFormData({
      ...formData,
      pictureUrl: '',
      pictureComment: '',
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/images/Logo.jpg')} 
            style={styles.logo} 
            resizeMode="contain"
          />
        </View>
        
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
        >
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
          <Text style={styles.backButtonText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {successMessage && (
          <View style={styles.successMessage}>
            <Ionicons name="checkmark-circle" size={24} color="green" />
            <Text style={styles.successText}>{successMessage}</Text>
          </View>
        )}

        <View style={styles.header}>
          <Text style={styles.headerTitle}>{inspectionName}</Text>
          {status && (
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) }]}>
              <Text style={styles.statusText}>{status}</Text>
            </View>
          )}
        </View>

        {isPending && (
          <View style={styles.infoMessage}>
            <Ionicons name="information-circle" size={24} color="#007AFF" />
            <Text style={styles.infoText}>This is a pending inspection. Only application details are prefilled.</Text>
          </View>
        )}

        {isCompleted && (
          <View style={styles.infoMessage}>
            <Ionicons name="eye" size={24} color="#28a745" />
            <Text style={styles.infoText}>Viewing completed inspection data. All fields are prefilled.</Text>
          </View>
        )}
      </View>

      <Text style={styles.sectionTitle}>Customer Details</Text>
      
      <Text style={styles.requiredFieldsNote}>Fields marked with * are required</Text>
      
      {loadingMessage && (
        <View style={styles.loadingMessageContainer}>
          <ActivityIndicator color="#007AFF" size="small" style={styles.loadingIndicator} />
          <Text style={styles.loadingMessageText}>{loadingMessage}</Text>
        </View>
      )}

      

      <View style={styles.formSection}>
        
        <Text style={styles.label}>Inspection ID *</Text>
        {isViewing ? (
          <Text style={styles.displayText}>{formData.applicationId}</Text>
        ) : (
          <>
            <TextInput
              style={[styles.input, errors.applicationId ? styles.inputError : null]}
              value={formData.applicationId}
              onChangeText={(text) => handleFieldChange('applicationId', text)}
              onBlur={() => {
                if (!formData.applicationId.trim()) {
                  setErrors({ ...errors, applicationId: 'Inspection ID is required' });
                }
              }}
              placeholder="Enter Inspection ID"
            />
            {errors.applicationId ? (
              <Text style={styles.errorText}>{errors.applicationId}</Text>
            ) : null}
          </>
        )}

        <Text style={styles.label}>First Name *</Text>
        {isViewing ? (
          <Text style={styles.displayText}>{`${formData.firstName} ${formData.lastName}`}</Text>
        ) : (
          <>
            <TextInput
              style={[styles.input, errors.firstName ? styles.inputError : null]}
              value={formData.firstName}
              onChangeText={(text) => handleFieldChange('firstName', text)}
              onBlur={() => {
                if (!formData.firstName.trim()) {
                  setErrors({ ...errors, firstName: 'First Name is required' });
                }
              }}
              placeholder="Enter your first name"
            />
            {errors.firstName ? (
              <Text style={styles.errorText}>{errors.firstName}</Text>
            ) : null}

            <Text style={styles.label}>Last Name *</Text>
            <TextInput
              style={[styles.input, errors.lastName ? styles.inputError : null]}
              value={formData.lastName}
              onChangeText={(text) => handleFieldChange('lastName', text)}
              onBlur={() => {
                if (!formData.lastName.trim()) {
                  setErrors({ ...errors, lastName: 'Last Name is required' });
                }
              }}
              placeholder="Enter your last name"
            />
            {errors.lastName ? (
              <Text style={styles.errorText}>{errors.lastName}</Text>
            ) : null}
          </>
        )}
        
        <Text style={styles.label}>Location *</Text>
        {isViewing ? (
          <Text style={styles.displayText}>{formData.location}</Text>
        ) : (
          <>
            <TextInput
              style={[styles.input, errors.location ? styles.inputError : null]}
              value={formData.location}
              onChangeText={(text) => handleFieldChange('location', text)}
              onBlur={() => {
                if (!formData.location.trim()) {
                  setErrors({ ...errors, location: 'Location is required' });
                }
              }}
              placeholder="Enter Location"
            />
            {errors.location ? (
              <Text style={styles.errorText}>{errors.location}</Text>
            ) : null}
          </>
        )}

        <Text style={styles.label}>Contact Phone *</Text>
        {isViewing ? (
          <Text style={styles.displayText}>{formData.phone}</Text>
        ) : (
          <>
            <TextInput
              style={[styles.input, errors.phone ? styles.inputError : null]}
              value={formData.phone}
              onChangeText={(text) => handleFieldChange('phone', text)}
              onBlur={() => {
                if (!formData.phone.trim()) {
                  setErrors({ ...errors, phone: 'Phone Number is required' });
                }
              }}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
            {errors.phone ? (
              <Text style={styles.errorText}>{errors.phone}</Text>
            ) : null}
          </>
        )}

        <Text style={styles.label}>Contact Email *</Text>
        {isViewing ? (
          <Text style={styles.displayText}>{formData.contact}</Text>
        ) : (
          <TextInput
            style={styles.input}
            value={formData.contact}
            onChangeText={(text) => handleFieldChange('contact', text)}
            placeholder="Enter your email"
            keyboardType="email-address"
          />
        )}
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>General Questions</Text>
        
        <View style={styles.formRow}>
          <Text style={styles.labelText}>Is there a washbasin in the laundry?</Text>
          {isViewing ? (
            <Text style={styles.displayText}>{formData.isWashbasin ? 'Yes' : 'No'}</Text>
          ) : (
            <View style={styles.switchContainer}>
              <Text style={styles.switchValueText}>{formData.isWashbasin ? 'Yes' : 'No'}</Text>
              <Switch
                value={formData.isWashbasin}
                onValueChange={(value) => setFormData({...formData, isWashbasin: value})}
              />
            </View>
          )}
        </View>
        
        <View style={styles.formRow}>
          <Text style={styles.labelText}>Is there a refrigerator in the property?</Text>
          {isViewing ? (
            <Text style={styles.displayText}>{formData.isRefrigerator ? 'Yes' : 'No'}</Text>
          ) : (
            <View style={styles.switchContainer}>
              <Text style={styles.switchValueText}>{formData.isRefrigerator ? 'Yes' : 'No'}</Text>
              <Switch
                value={formData.isRefrigerator}
                onValueChange={(value) => setFormData({...formData, isRefrigerator: value})}
              />
            </View>
          )}
        </View>
        
        <View style={styles.formRow}>
          <Text style={styles.labelText}>Is there a usable garage on the property?</Text>
          {isViewing ? (
            <Text style={styles.displayText}>{formData.isGarage ? 'Yes' : 'No'}</Text>
          ) : (
            <View style={styles.switchContainer}>
              <Text style={styles.switchValueText}>{formData.isGarage ? 'Yes' : 'No'}</Text>
              <Switch
                value={formData.isGarage}
                onValueChange={(value) => setFormData({...formData, isGarage: value})}
              />
            </View>
          )}
        </View>

        <View style={styles.formRow}>
          <Text style={styles.labelText}>What steps have you taken to secure the property?</Text>
        </View>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          multiline
          placeholder="Enter your answer here..."
          value={formData.genericQuestion4}
          onChangeText={(text) => handleFieldChange('genericQuestion4', text)}
          editable={!(isViewing && status === 'Completed')}
        />
      </View>

      <View style={styles.imageSection}>
        <Text style={styles.label}>Upload Picture</Text>
        <View style={styles.imageButtonsContainer}>
          <TouchableOpacity 
            style={[
              styles.uploadButton, 
              uploadingImage && styles.buttonDisabled,
              image ? styles.changeButton : styles.uploadButton
            ]}
            onPress={pickImage}
            disabled={uploadingImage}
          >
            <Text style={styles.uploadButtonText}>
              {image ? 'Change Picture' : 'Select Picture'}
            </Text>
          </TouchableOpacity>
          
          {image && (
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={removeImage}
              disabled={uploadingImage}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {uploadingImage && (
          <View style={styles.uploadingContainer}>
            <ActivityIndicator color="#007AFF" />
            <Text style={styles.uploadingText}>Uploading image...</Text>
          </View>
        )}
        
        {image && (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: image }} style={styles.imagePreview} />
          </View>
        )}
        
        <Text style={[styles.label, { marginTop: 15 }]}>Image Comment</Text>
        <TextInput
          style={[styles.input, styles.commentInput]}
          value={formData.pictureComment}
          onChangeText={(text) => setFormData({ ...formData, pictureComment: text })}
          placeholder="Add a description or notes about this image"
          multiline={true}
          numberOfLines={3}
        />
      </View>

      <TouchableOpacity
        style={[styles.submitButton, (loading || uploadingImage) && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading || uploadingImage}
      >
        {loading ? (
          <View style={styles.loadingButtonContent}>
            <ActivityIndicator color="#fff" />
            <Text style={styles.loadingButtonText}>Submitting...</Text>
          </View>
        ) : (
          <Text style={styles.submitButtonText}>Submit Inspection</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.clearButton, (loading || uploadingImage) && styles.buttonDisabled]}
        onPress={resetForm}
        disabled={loading || uploadingImage}
      >
        <Text style={styles.clearButtonText}>Clear Form</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Helper function to get the icon based on inspection type
function getInspectionIcon(inspectionType: number | null): React.ComponentProps<typeof Ionicons>['name'] {
  switch (inspectionType) {
    case 1: return 'home-outline';
    case 2: return 'business-outline';
    case 3: return 'key-outline';
    case 4: return 'cart-outline';
    case 5: return 'shield-outline';
    case 6: return 'construct-outline';
    default: return 'document-outline';
  }
}

// Helper function to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed': return '#28a745';
    case 'Pending': return '#ffc107';
    case 'Cancelled': return '#dc3545';
    default: return '#6c757d';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoContainer: {
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: 150,
    height: 150,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: 10,
    top: 10,
  },
  backButtonText: {
    color: '#007AFF',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  switchValueText: {
    marginRight: 10,
    fontWeight: 'bold',
    color: '#007AFF',
    width: 40,
    textAlign: 'center',
  },
  questionnaireSection: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  questionnaireTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  questionnaireSubtitle: {
    fontSize: 14,
    marginBottom: 15,
    color: '#666',
    fontStyle: 'italic',
  },
  imageSection: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  uploadButton: {
    backgroundColor: '#e9f5ff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
    flex: 1,
  },
  changeButton: {
    flex: 0.7,
  },
  removeButton: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f44336',
    marginLeft: 10,
    flex: 0.3,
  },
  removeButtonText: {
    color: '#f44336',
    fontWeight: 'bold',
  },
  uploadButtonText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  imagePreviewContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  successMessageContainer: {
    backgroundColor: '#d4edda',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#c3e6cb',
  },
  successMessageText: {
    color: '#155724',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  clearButtonText: {
    color: '#6c757d',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingMessageContainer: {
    backgroundColor: '#cce5ff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#b8daff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingIndicator: {
    marginRight: 10,
  },
  loadingMessageText: {
    color: '#004085',
    flex: 1,
  },
  uploadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  uploadingText: {
    marginLeft: 10,
    color: '#007AFF',
  },
  loadingButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  requiredFieldsNote: {
    color: '#6c757d',
    fontSize: 14,
    marginBottom: 15,
    fontStyle: 'italic',
  },
  inputError: {
    borderColor: '#dc3545',
    backgroundColor: '#fff8f8',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 5,
  },
  commentInput: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  inspectionTypeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e9f5ff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#b8daff',
  },
  inspectionTypeText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#004085',
    fontWeight: '500',
  },
  formSection: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  labelText: {
    fontSize: 16,
    flex: 1,
  },
  textInput: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  content: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginLeft: 10,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  infoMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  infoText: {
    marginLeft: 8,
    color: '#495057',
    flex: 1,
  },
  successMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d4edda',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#c3e6cb',
  },
  successText: {
    marginLeft: 8,
    color: '#155724',
    flex: 1,
  },
  displayText: {
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
});