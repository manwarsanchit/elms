package com.leavemanagement.backend.controller;

import com.leavemanagement.backend.dto.LeaveRequestDTO;
import com.leavemanagement.backend.dto.LeaveResponse;
import com.leavemanagement.backend.entity.LeaveRequest;
import com.leavemanagement.backend.entity.User;
import com.leavemanagement.backend.service.LeaveRequestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/leaves")
@CrossOrigin(origins = "*")
public class LeaveController {

    @Autowired
    private LeaveRequestService leaveRequestService;

    private User currentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private LeaveResponse toResponse(LeaveRequest lr) {
        return new LeaveResponse(
                lr.getId(), lr.getUser().getId(), lr.getUser().getName(), lr.getLeaveType(),
                lr.getFromDate(), lr.getToDate(), lr.getReason(), lr.getStatus(), lr.getCreatedAt());
    }

    @PostMapping
    public ResponseEntity<LeaveResponse> applyForLeave(@Valid @RequestBody LeaveRequestDTO dto) {
        LeaveRequest saved = leaveRequestService.createLeaveRequest(
                currentUser(), dto.getLeaveType(), dto.getFromDate(), dto.getToDate(), dto.getReason());
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(saved));
    }

    @GetMapping
    public List<LeaveResponse> getMyLeaveRequests() {
        return leaveRequestService.getLeaveRequestsByUserId(currentUser().getId())
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @PutMapping("/{id}")
    public ResponseEntity<LeaveResponse> updateLeaveRequest(@PathVariable Long id,
            @Valid @RequestBody LeaveRequestDTO dto) {
        LeaveRequest updated = leaveRequestService.updateLeaveRequest(
                id, currentUser(), dto.getLeaveType(), dto.getFromDate(), dto.getToDate(), dto.getReason());
        return ResponseEntity.ok(toResponse(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelLeaveRequest(@PathVariable Long id) {
        leaveRequestService.cancelLeaveRequest(id, currentUser());
        return ResponseEntity.noContent().build();
    }

}
