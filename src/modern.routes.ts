import { defineRoutes } from '@modern-js/runtime/config-routes';

export default defineRoutes(({ layout, page, $ }) => [
  layout('layouts/AppLayout.tsx', '', [
    page('pages/HomePage.tsx', '/'),
    page('pages/QuestionPage.tsx', 'questions/:questionId'),
    $('pages/NotFoundPage.tsx', '*'),
  ]),
]);
