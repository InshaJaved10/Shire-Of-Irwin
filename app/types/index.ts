export interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  createdAt: Date;
}

export interface ApplicationFormData {
  applicationId: string;
  firstName: string;
  lastName: string;
  contact: string;
  phone: string;
  isWashBasin: boolean;
  isRefrigerator: boolean;
  isGarage: boolean;
  picture: string | null;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  genericQuestion4: string;
} 