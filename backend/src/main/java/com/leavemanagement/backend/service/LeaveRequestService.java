package com.leavemanagement.backend.service;

import com.leavemanagement.backend.entity.LeaveRequest;
import com.leavemanagement.backend.entity.User;
import com.leavemanagement.backend.exception.ConflictException;
import com.leavemanagement.backend.exception.ForbiddenException;
import com.leavemanagement.backend.exception.ResourceNotFoundException;
import com.leavemanagement.backend.repository.LeaveRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeaveRequestService {

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    public LeaveRequest createLeaveRequest(LeaveRequest leaveRequest) {
        return leaveRequestRepository.save(leaveRequest);
    }

    public List<LeaveRequest> getAllLeaveRequests() {
        return leaveRequestRepository.findAll();
    }

    public List<LeaveRequest> getLeaveRequestsByUserId(Long userId) {
        return leaveRequestRepository.findByUserId(userId);
    }

    public LeaveRequest getLeaveRequestById(Long id) {
        return leaveRequestRepository.findById(id).orElse(null);
    }

    public LeaveRequest createLeaveRequest(User user, String leaveType,
            LocalDate fromDate, LocalDate toDate, String reason) {
        LeaveRequest leaveRequest = new LeaveRequest(user, leaveType, fromDate,
                toDate, reason, "PENDING");
        return leaveRequestRepository.save(leaveRequest);
    }

    public LeaveRequest updateLeaveRequest(Long id, User currentUser, String leaveType, LocalDate fromDate,
            LocalDate toDate, String reason) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found"));

        if (!leaveRequest.getUser().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("You can only edit your own leave requests");
        }
        if (!leaveRequest.getStatus().equals("PENDING")) {
            throw new ConflictException("Only pending requests can be edited");
        }

        leaveRequest.setLeaveType(leaveType);
        leaveRequest.setFromDate(fromDate);
        leaveRequest.setToDate(toDate);
        leaveRequest.setReason(reason);
        return leaveRequestRepository.save(leaveRequest);
    }

    public void cancelLeaveRequest(Long id, User currentUser) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found"));

        if (!leaveRequest.getUser().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("You can only cancel your own leave requests");
        }
        if (!leaveRequest.getStatus().equals("PENDING")) {
            throw new ConflictException("Only pending requests can be cancelled");
        }

        leaveRequestRepository.delete(leaveRequest);
    }

    public List<LeaveRequest> getFilteredLeaveRequests(String status, String leaveType) {
        return leaveRequestRepository.findAll().stream()
                .filter(lr -> status == null || lr.getStatus().equalsIgnoreCase(status))
                .filter(lr -> leaveType == null || lr.getLeaveType().equalsIgnoreCase(leaveType))
                .collect(Collectors.toList());
    }

    public LeaveRequest updateStatus(Long id, String status, LocalDate fromDate, LocalDate toDate) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found"));

        if (fromDate != null && toDate != null) {
            if (fromDate.isAfter(toDate)) {
                throw new ConflictException("From date must be before or equal to To date");
            }
            leaveRequest.setFromDate(fromDate);
            leaveRequest.setToDate(toDate);
        }

        leaveRequest.setStatus(status);
        return leaveRequestRepository.save(leaveRequest);
    }

}
