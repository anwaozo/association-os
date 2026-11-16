// The API accepts a limited number of people per request (serverless time
// limits), so large CSV imports are sent in chunks. Returns the number imported.
export const IMPORT_CHUNK = 200;

export async function importInChunks(api, people) {
   let imported = 0;
   for (let i = 0; i < people.length; i += IMPORT_CHUNK) {
      const res = await api.post('/auth/bulk_register', { users: people.slice(i, i + IMPORT_CHUNK) }, { timeout: 60000 });
      imported += res.data?.count || 0;
   }
   return imported;
}
