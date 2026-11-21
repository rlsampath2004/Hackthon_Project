package com.finwise.finwise.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.finwise.finwise.entity.RecurringBill;
import com.finwise.finwise.repo.RecurringBillRepository;
import com.finwise.finwise.service.RecurringBillService;

@Service
public class RecurringBillServiceImpl implements RecurringBillService {

	private final RecurringBillRepository recurringBillRepository;

	public RecurringBillServiceImpl(RecurringBillRepository recurringBillRepository) {
		this.recurringBillRepository = recurringBillRepository;
	}

	@Override
	public RecurringBill createRecurringBill(RecurringBill recurringBill) {
		return recurringBillRepository.save(recurringBill);
	}

	@Override
	public RecurringBill getRecurringBillById(Long billId) {
		return recurringBillRepository.findById(billId)
				.orElseThrow(() -> new RuntimeException("Recurring bill not found with ID: " + billId));
	}

	@Override
	public List<RecurringBill> getAllRecurringBillsByUser(Long userId) {
		return recurringBillRepository.findByUser_UserId(userId);
	}

	@Override
	public List<RecurringBill> getActiveRecurringBills(Long userId) {
		return recurringBillRepository.findByUser_UserIdAndIsActive(userId, true);
	}

	@Override
	public RecurringBill updateRecurringBill(Long billId, RecurringBill updatedBill) {

		RecurringBill existingBill = getRecurringBillById(billId);

		existingBill.setBillName(updatedBill.getBillName());
		existingBill.setAmount(updatedBill.getAmount());
		existingBill.setFrequency(updatedBill.getFrequency());
		existingBill.setNextDueDate(updatedBill.getNextDueDate());
		existingBill.setIsActive(updatedBill.getIsActive());
		existingBill.setCategory(updatedBill.getCategory());

		return recurringBillRepository.save(existingBill);
	}

	@Override
	public void deleteRecurringBill(Long billId) {
		RecurringBill existingBill = getRecurringBillById(billId);
		recurringBillRepository.delete(existingBill);
	}
}