import { TYPE_SERVICE_URL } from '@/constants/api';
import { http, HttpResponse } from 'msw';
import { types } from '../db';
import { properties } from '../db/properties';
import { records } from '../db/record/records';

const BASE_URL = `${import.meta.env.VITE_API_GATEWAY_HOST}/api/v1`;

export const handlers = [
  http.get(`${TYPE_SERVICE_URL}`, () => {
    return HttpResponse.json(types);
  }),

  http.get(`${BASE_URL}/abc/types`, async () => {
    const typeExample = types;
    return HttpResponse.json(typeExample);
  }),

  http.get(`${BASE_URL}/abc/types/properties`, async () => {
    const propertyExamples = properties;
    return HttpResponse.json(propertyExamples);
  }),
  http.get(`${TYPE_SERVICE_URL}/:typeId/records`, async ({ params }) => {
    const typeId = params.typeId;

    const findRecords = records.find((record) => record.id === typeId);

    return HttpResponse.json(findRecords, {
      status: 200
    });
  })
];
