import test from 'node:test';
import assert from 'node:assert/strict';
import { getOrderDateInfo, getOrderDateTimestamp } from './service-order-date.util.ts';

test('Debe priorizar fecha de entrega real si está presente', () => {
  const row = {
    id: '1',
    orderNumber: 'OS-001',
    clientName: 'Cliente A',
    statusName: 'Entregada',
    priority: 1,
    createdAt: '2026-01-01T10:00:00Z',
    estimatedEndDate: '2026-01-15T18:00:00Z',
    actualEndDate: '2026-01-20T18:00:00Z',
    budgetedAmount: 100,
    collectedAmount: 100
  };

  const info = getOrderDateInfo(row);
  assert.equal(info.date, '2026-01-20T18:00:00Z');
  assert.equal(info.tooltip, 'Fecha de entrega real');
  assert.equal(info.icon, 'check_circle');
  assert.equal(info.cssClass, 'date-icon-actual');
  assert.equal(info.type, 'actual');
});

test('Debe usar fecha presupuestada de entrega si no hay fecha real pero sí presupuestada', () => {
  const row = {
    id: '2',
    orderNumber: 'OS-002',
    clientName: 'Cliente B',
    statusName: 'Iniciada',
    priority: 1,
    createdAt: '2026-02-01T10:00:00Z',
    estimatedEndDate: '2026-02-25T18:00:00Z',
    actualEndDate: undefined,
    budgetedAmount: 200,
    collectedAmount: 0
  };

  const info = getOrderDateInfo(row);
  assert.equal(info.date, '2026-02-25T18:00:00Z');
  assert.equal(info.tooltip, 'Fecha presupuestada de entrega');
  assert.equal(info.icon, 'schedule');
  assert.equal(info.cssClass, 'date-icon-estimated');
  assert.equal(info.type, 'estimated');
});

test('Debe usar fecha de alta si no hay fecha real ni presupuestada', () => {
  const row = {
    id: '3',
    orderNumber: 'OS-003',
    clientName: 'Cliente C',
    statusName: 'Pendiente',
    priority: 1,
    createdAt: '2026-03-01T10:00:00Z',
    estimatedEndDate: undefined,
    actualEndDate: undefined,
    budgetedAmount: 300,
    collectedAmount: 0
  };

  const info = getOrderDateInfo(row);
  assert.equal(info.date, '2026-03-01T10:00:00Z');
  assert.equal(info.tooltip, 'Fecha de alta');
  assert.equal(info.icon, 'calendar_today');
  assert.equal(info.cssClass, 'date-icon-created');
  assert.equal(info.type, 'created');
});

test('getOrderDateTimestamp debe retornar el timestamp numérico correcto para ordenamiento', () => {
  const row = {
    createdAt: '2026-01-01T00:00:00Z',
    estimatedEndDate: '2026-01-10T00:00:00Z'
  };

  const ts = getOrderDateTimestamp(row);
  assert.equal(ts, new Date('2026-01-10T00:00:00Z').getTime());
});
