package com.eventmanagement.backend.service;

import org.redisson.api.RedissonClient;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.eventmanagement.backend.repository.OrderRepository;
import com.eventmanagement.backend.repository.TicketRepository;
import com.eventmanagement.backend.repository.TicketTypeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingService {
    
    private final RedisTemplate<String, Object> redisTemplate;
    private final RedissonClient redissonClient;
    private final TicketTypeRepository ticketTypeRepository;
    private final OrderRepository orderRepository;
    private final TicketRepository ticketRepository;
    private final CodeGen
}
