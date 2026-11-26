
package com.iraasoft.usermanagement.repository;

import com.iraasoft.usermanagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long>{

}
