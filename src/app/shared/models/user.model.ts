export interface User {
  id: string;
  login: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  imageUrl?: string;
  activated: boolean;
  enabled: boolean;
  mustChangePassword: boolean;
  langKey: string;
  createdBy: string;
  createdDate: any;
  lastModifiedBy: string;
  lastModifiedDate: any;
  countryId: string;
  countryName: string;
  dispatchCenterId: string;
  dispatchcenter: string;
  createdByDisplay: string;
  lastModifiedByDisplay: string;
  roles: any;
}
