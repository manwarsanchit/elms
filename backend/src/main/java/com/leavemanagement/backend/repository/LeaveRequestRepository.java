package com.leavemanagement.backend.repository;

import com.leavemanagement.backend.entity.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long>{

    List<LeaveRequest> findByUserId (Long userId);

}