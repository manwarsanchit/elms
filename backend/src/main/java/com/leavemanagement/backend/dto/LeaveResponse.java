package com.leavemanagement.backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class LeaveResponse {

    private Long id;
    private Long userId;
    private String userName;
    private String leaveType;
    private LocalDate fromDate;
    private LocalDate toDate;
    private String reason;
    private String status;
    private LocalDateTime createdAt;

    public LeaveResponse(Long id, Long userId, String userName, String leaveType,
            LocalDate fromDate, LocalDate toDate, String reason, String status,
            LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.leaveType = leaveType;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.reason = reason;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUserName() {
        return userName;
    }

    public String getLeaveType() {
        return leaveType;
    }

    public LocalDate getFromDate() {
        return fromDate;
    }

    public LocalDate getToDate() {
        return toDate;
    }

    public String getReason() {
        return reason;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
