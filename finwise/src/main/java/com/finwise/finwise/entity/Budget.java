package com.finwise.finwise.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "budgets", uniqueConstraints = {
		@UniqueConstraint(columnNames = { "user_id", "category_id", "budget_month" }) })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Budget {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long budgetId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "category_id", nullable = false)
	private Category category;

	@Column(precision = 12, scale = 2, nullable = false)
	private BigDecimal monthlyLimit;

	private LocalDate budgetMonth;

	private LocalDateTime createdAt;

	@PrePersist
	public void onCreate() {
		createdAt = LocalDateTime.now();
	}

	public Long getBudgetId() {
		return budgetId;
	}

	public void setBudgetId(Long budgetId) {
		this.budgetId = budgetId;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public Category getCategory() {
		return category;
	}

	public void setCategory(Category category) {
		this.category = category;
	}

	public BigDecimal getMonthlyLimit() {
		return monthlyLimit;
	}

	public void setMonthlyLimit(BigDecimal monthlyLimit) {
		this.monthlyLimit = monthlyLimit;
	}

	public LocalDate getBudgetMonth() {
		return budgetMonth;
	}

	public void setBudgetMonth(LocalDate budgetMonth) {
		this.budgetMonth = budgetMonth;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
}