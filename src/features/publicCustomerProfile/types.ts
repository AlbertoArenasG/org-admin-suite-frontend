export interface PublicCustomerProfileAddress {
  street: string | null;
  number: string | null;
  neighborhood: string | null;
  delegation: string | null;
  city: string | null;
  postalCode: string | null;
}

export interface PublicCustomerProfileCfdi {
  use: string | null;
  paymentMethod: string | null;
  paymentForm: string | null;
}

export interface PublicCustomerProfileContact {
  name: string | null;
  phone: string | null;
  email: string | null;
}

export interface PublicCustomerProfileFileMetadata {
  fileId: string;
  originalName: string;
  downloadUrl: string | null;
}

export interface PublicCustomerFiscalProfile {
  id: string;
  statusId: string;
  statusName: string;
  submittedAt: string | null;
  businessName: string | null;
  rfc: string | null;
  taxRegime: string | null;
  address: PublicCustomerProfileAddress | null;
  cfdi: PublicCustomerProfileCfdi | null;
  billingContact: PublicCustomerProfileContact | null;
  accountsPayableContact: PublicCustomerProfileContact | null;
  requirementsNotes: string | null;
  taxCertificateFileId: string | null;
  invoiceRequirementsFileId: string | null;
  filesMetadata: {
    taxCertificate?: PublicCustomerProfileFileMetadata | null;
    invoiceRequirements?: PublicCustomerProfileFileMetadata | null;
  } | null;
}

export interface PublicCustomerProfile {
  customerId: string;
  companyName: string;
  clientCode: string;
  statusId: string;
  statusName: string;
  publicAccessToken: string;
  publicAccessUrl: string;
  createdAt: string;
  updatedAt: string;
  fiscalProfile: PublicCustomerFiscalProfile | null;
}

export interface PublicCustomerProfileFormValues {
  businessName: string;
  rfc: string;
  taxRegime: string;
  address: {
    street: string;
    number: string;
    neighborhood: string;
    delegation: string;
    city: string;
    postalCode: string;
  };
  cfdi: {
    use: string;
    paymentMethod: string;
    paymentForm: string;
  };
  billingContact: {
    name: string;
    phone: string;
    email: string;
  };
  accountsContact: {
    name: string;
    phone: string;
    email: string;
  };
  requirementsNotes: string;
  taxCertificateFileId: string | null;
  invoiceRequirementsFileId: string | null;
}

export interface PublicCustomerProfileSubmissionPayload {
  business_name: string;
  rfc: string;
  tax_regime: string;
  street: string;
  number: string;
  neighborhood: string;
  delegation: string;
  city: string;
  postal_code: string;
  cfdi_use: string;
  payment_method: string;
  payment_form: string;
  billing_contact: PublicCustomerProfileContactPayload;
  accounts_payable_contact: PublicCustomerProfileContactPayload;
  requirements_notes: string;
  tax_certificate_file_id: string | null;
  invoice_requirements_file_id: string | null;
}

export interface PublicCustomerProfileContactPayload {
  name: string | null;
  phone: string | null;
  email: string | null;
}

export interface PublicCustomerUploadedFile {
  id: string;
  originalName: string;
  filename: string;
  mimeType: string;
  downloadUrl: string | null;
  size: number;
}
