package com.leavemanagement.backend.dto;

import jakarta.validation.constraints.Pattern;

import java.time.LocalDate;

public class StatusUpdateDTO {

    @Pattern(regexp = "APPROVED|REJECTED", message = "Status must be APPROVED or REJECTED")
    private String status;

    private LocalDate fromDate;
    private LocalDate toDate;

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getFromDate() { return fromDate; }
    public void setFromDate(LocalDate fromDate) { this.fromDate = fromDate; }

    public LocalDate getToDate() { return toDate; }
    public void setToDate(LocalDate toDate) { this.toDate = toDate; }
}
