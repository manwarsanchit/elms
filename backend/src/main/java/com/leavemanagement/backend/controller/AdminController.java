package com.leavemanagement.backend.controller;

import com.leavemanagement.backend.dto.LeaveResponse;
import com.leavemanagement.backend.dto.StatusUpdateDTO;
import com.leavemanagement.backend.entity.LeaveRequest;
import com.leavemanagement.backend.entity.User;
import com.leavemanagement.backend.exception.ForbiddenException;
import com.leavemanagement.backend.service.LeaveRequestService;
import jakarta.validation.Valid;

import org.aspectj.lang.annotation.RequiredTypes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/leaves")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private LeaveRequestService leaveRequestService;

    private User currentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private void requireAdmin() {
        if (!currentUser().getRole().equals("ADMIN")) {
            throw new ForbiddenException("Admin access required");
        }
    }

    private LeaveResponse toResponse(LeaveRequest lr) {
        return new LeaveResponse(
                lr.getId(), lr.getUser().getId(), lr.getUser().getName(), lr.getLeaveType(),
                lr.getFromDate(), lr.getToDate(), lr.getReason(), lr.getStatus(), lr.getCreatedAt());
    }

    @GetMapping
    public List<LeaveResponse> getAllLeaveRequests(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String leaveType) {
        requireAdmin();
        return leaveRequestService.getFilteredLeaveRequests(status, leaveType)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @PutMapping("/{id}/status")
    public LeaveResponse updateStatus(@PathVariable Long id,
            @Valid @RequestBody StatusUpdateDTO dto) {
        requireAdmin();
        LeaveRequest updated = leaveRequestService.updateStatus(id, dto.getStatus(), dto.getFromDate(),
                dto.getToDate());
        return toResponse(updated);
    }
}
