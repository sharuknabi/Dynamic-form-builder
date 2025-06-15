
// Mock database - in a real app, this would be a proper database
interface FormSubmission {
  id: string;
  formId: string;
  values: Record<string, any>;
  submittedAt: string;
}

interface StoredForm {
  id: string;
  name: string;
  description: string;
  fields: any[];
  createdAt: string;
  submissions: FormSubmission[];
}

// In-memory storage for demo purposes
let forms: StoredForm[] = [
  {
    id: 'sample-1',
    name: 'Contact Form',
    description: 'Get in touch with us',
    createdAt: new Date().toISOString(),
    fields: [
      {
        id: 'field-1',
        type: 'text',
        label: 'Full Name',
        placeholder: 'Enter your full name',
        required: true
      },
      {
        id: 'field-2',
        type: 'text',
        label: 'Email Address',
        placeholder: 'Enter your email',
        required: true
      },
      {
        id: 'field-3',
        type: 'textarea',
        label: 'Message',
        placeholder: 'Enter your message here...',
        required: true
      }
    ],
    submissions: []
  },
  {
    id: 'sample-2',
    name: 'Survey Form',
    description: 'Help us improve our services',
    createdAt: new Date().toISOString(),
    fields: [
      {
        id: 'field-1',
        type: 'select',
        label: 'How did you hear about us?',
        required: true,
        options: ['Google Search', 'Social Media', 'Friend Referral', 'Advertisement']
      },
      {
        id: 'field-2',
        type: 'radio',
        label: 'Rate our service',
        required: true,
        options: ['Excellent', 'Good', 'Average', 'Poor']
      },
      {
        id: 'field-3',
        type: 'checkbox',
        label: 'Subscribe to newsletter',
        required: false
      }
    ],
    submissions: []
  }
];

let idCounter = forms.length + 1;

export const formsAPI = {
  // GET /api/forms - Get all forms
  getForms: () => {
    return forms.map(form => ({
      id: form.id,
      name: form.name,
      description: form.description,
      createdAt: form.createdAt,
      fieldCount: form.fields.length
    }));
  },

  // GET /api/forms/:id - Get a specific form
  getForm: (id: string) => {
    return forms.find(form => form.id === id);
  },

  // POST /api/forms - Create a new form
  createForm: (formData: { name: string; description: string; fields: any[] }) => {
    const newForm: StoredForm = {
      id: `form-${idCounter++}`,
      name: formData.name,
      description: formData.description,
      fields: formData.fields,
      createdAt: new Date().toISOString(),
      submissions: []
    };
    
    forms.push(newForm);
    return newForm;
  },

  // PUT /api/forms/:id - Update a form
  updateForm: (id: string, updates: Partial<StoredForm>) => {
    const formIndex = forms.findIndex(form => form.id === id);
    if (formIndex === -1) return null;
    
    forms[formIndex] = { ...forms[formIndex], ...updates };
    return forms[formIndex];
  },

  // DELETE /api/forms/:id - Delete a form
  deleteForm: (id: string) => {
    const formIndex = forms.findIndex(form => form.id === id);
    if (formIndex === -1) return false;
    
    forms.splice(formIndex, 1);
    return true;
  },

  // POST /api/forms/:id/submit - Submit form data
  submitForm: (id: string, submission: { values: Record<string, any>; submittedAt: string }) => {
    const form = forms.find(f => f.id === id);
    if (!form) return null;

    const newSubmission: FormSubmission = {
      id: `submission-${Date.now()}`,
      formId: id,
      values: submission.values,
      submittedAt: submission.submittedAt
    };

    form.submissions.push(newSubmission);
    return newSubmission;
  },

  // GET /api/forms/:id/submissions - Get form submissions
  getSubmissions: (id: string) => {
    const form = forms.find(f => f.id === id);
    return form ? form.submissions : [];
  }
};
