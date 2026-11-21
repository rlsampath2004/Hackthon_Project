package com.finwise.finwise.service;

import java.util.List;

import com.finwise.finwise.entity.RecurringBill;

public interface RecurringBillService {

    RecurringBill createRecurringBill(RecurringBill recurringBill);

    RecurringBill getRecurringBillById(Long billId);

    List<RecurringBill> getAllRecurringBillsByUser(Long userId);

    List<RecurringBill> getActiveRecurringBills(Long userId);

    RecurringBill updateRecurringBill(Long billId, RecurringBill recurringBill);

    void deleteRecurringBill(Long billId);

}