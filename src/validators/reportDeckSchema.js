import * as yup from 'yup';

export const reportDeckSchema = yup.object({
  reportReason: yup.string().required('Report reason is required').trim(),
  reportDetail: yup.string().optional().trim(),
});