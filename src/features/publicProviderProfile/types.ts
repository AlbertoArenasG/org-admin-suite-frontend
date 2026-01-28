export interface PublicProviderProfileAddress {
  street: string | null;
  number: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
}

export interface PublicProviderProfileContact {
  name: string | null;
  phone: string | null;
  email: string | null;
}

export interface PublicProviderProfileFileMetadata {
  fileId: string;
  originalName: string;
  downloadUrl: string | null;
}

export interface PublicProviderFiscalProfile {
  id: string;
  statusId: string;
  statusName: string;
  submittedAt: string | null;
  businessName: string | null;
  rfc: string | null;
  address: PublicProviderProfileAddress | null;
  billingContact: PublicProviderProfileContact | null;
  notes: string | null;
  taxStatusCertificateFileId: string | null;
  taxComplianceOpinionFileId: string | null;
  addressProofFileId: string | null;
  filesMetadata: {
    taxStatusCertificate?: PublicProviderProfileFileMetadata | null;
    taxComplianceOpinion?: PublicProviderProfileFileMetadata | null;
    addressProof?: PublicProviderProfileFileMetadata | null;
  } | null;
}

export interface PublicProviderBankingInfo {
  id: string;
  statusId: string;
  statusName: string;
  submittedAt: string | null;
  beneficiary: string | null;
  bank: string | null;
  accountNumber: string | null;
  clabe: string | null;
  creditGranted: string | null;
  notes: string | null;
  bankStatementFileId: string | null;
  filesMetadata: {
    bankStatement?: PublicProviderProfileFileMetadata | null;
  } | null;
}

export interface PublicProviderProfile {
  providerId: string;
  companyName: string;
  providerCode: string;
  statusId: string;
  statusName: string;
  publicAccessToken: string;
  publicAccessUrl: string;
  contact: PublicProviderProfileContact | null;
  createdAt: string;
  updatedAt: string;
  fiscalProfile: PublicProviderFiscalProfile | null;
  bankingInfo: PublicProviderBankingInfo | null;
}

export interface PublicProviderProfileFormValues {
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  fiscalProfile: {
    businessName: string;
    rfc: string;
    address: {
      street: string;
      number: string;
      neighborhood: string;
      city: string;
      state: string;
      postalCode: string;
    };
    billingContact: {
      name: string;
      phone: string;
      email: string;
    };
    notes: string;
    taxStatusCertificateFileId: string | null;
    taxComplianceOpinionFileId: string | null;
    addressProofFileId: string | null;
  };
  bankingInfo: {
    beneficiary: string;
    bank: string;
    accountNumber: string;
    clabe: string;
    creditGranted: string;
    notes: string;
    bankStatementFileId: string | null;
  };
}

export interface PublicProviderProfileSubmissionPayload {
  contact: PublicProviderProfileContactPayload;
  fiscal_profile: {
    business_name: string;
    rfc: string;
    address: {
      street: string;
      number: string;
      neighborhood: string;
      city: string;
      state: string;
      postal_code: string;
    };
    billing_contact: PublicProviderProfileContactPayload;
    notes: string;
    tax_status_certificate_file_id: string | null;
    tax_compliance_opinion_file_id: string | null;
    address_proof_file_id: string | null;
  };
  banking_info: {
    beneficiary: string;
    bank: string;
    account_number: string;
    clabe: string;
    credit_granted: string;
    notes: string;
    bank_statement_file_id: string | null;
  };
}

export interface PublicProviderProfileContactPayload {
  name: string | null;
  phone: string | null;
  email: string | null;
}

export interface PublicProviderUploadedFile {
  id: string;
  originalName: string;
  filename: string;
  mimeType: string;
  downloadUrl: string | null;
  size: number;
}
