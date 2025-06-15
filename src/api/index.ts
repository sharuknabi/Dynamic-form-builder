
import { formsAPI } from './forms';

// Simulate API responses with proper status codes
export const handleAPIRequest = async (method: string, path: string, body?: any): Promise<Response> => {
  console.log(`API Request: ${method} ${path}`, body);

  try {
    // Forms endpoints
    if (path === '/api/forms' && method === 'GET') {
      const forms = formsAPI.getForms();
      return new Response(JSON.stringify(forms), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (path === '/api/forms' && method === 'POST') {
      if (!body || !body.name) {
        return new Response(JSON.stringify({ error: 'Name is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      const newForm = formsAPI.createForm(body);
      return new Response(JSON.stringify(newForm), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (path.startsWith('/api/forms/') && method === 'GET') {
      const id = path.split('/')[3];
      if (path.endsWith('/submissions')) {
        const submissions = formsAPI.getSubmissions(id);
        return new Response(JSON.stringify(submissions), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        const form = formsAPI.getForm(id);
        if (!form) {
          return new Response(JSON.stringify({ error: 'Form not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        return new Response(JSON.stringify(form), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    if (path.startsWith('/api/forms/') && method === 'PUT') {
      const id = path.split('/')[3];
      const updatedForm = formsAPI.updateForm(id, body);
      if (!updatedForm) {
        return new Response(JSON.stringify({ error: 'Form not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return new Response(JSON.stringify(updatedForm), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (path.startsWith('/api/forms/') && path.endsWith('/submit') && method === 'POST') {
      const id = path.split('/')[3];
      if (!body || !body.values) {
        return new Response(JSON.stringify({ error: 'Form values are required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      const submission = formsAPI.submitForm(id, body);
      if (!submission) {
        return new Response(JSON.stringify({ error: 'Form not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return new Response(JSON.stringify(submission), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Default 404
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Override fetch for API calls
const originalFetch = window.fetch;
window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = typeof input === 'string' ? input : input.toString();
  
  if (url.startsWith('/api/')) {
    const method = init?.method || 'GET';
    const body = init?.body ? JSON.parse(init.body as string) : undefined;
    return handleAPIRequest(method, url, body);
  }
  
  return originalFetch(input, init);
};
