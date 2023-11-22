// server actions

// mark all the exported functions within the file as server functions. These server functions can then be imported into Client and Server components, making them extremely versatile
// You can also write Server Actions directly inside Server Components by adding "use server" inside the action
'use server';

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(), //coerces string to number whilst also validating its type
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

// use entries() if there are many fields
export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;

  /* Since you're updating the data displayed in the invoices route, you want to clear this cache and trigger a new request to the server.
    You can do this with the revalidatePath function */
  revalidatePath('dashboard/invoices');
  //  redirect the user back to the /dashboard/invoices page after submission.
  redirect('/dashboard/invoices');
}

// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

// ...

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  }); // extracting data from the form data, validating with Zod

  const amountInCents = amount * 100; // converting amnount to cents

  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `; // pass variables to sql query

  revalidatePath('/dashboard/invoices'); // call revalidatePath to clear client cache and make new servant request
  redirect('/dashboard/invoices'); // redirect user back to invoices page once update is submitted
}

export async function deleteInvoice(id: string) {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
}
