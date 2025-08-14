package com.t2.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.DefaultClassMapper;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class RabbitConfig {

    public static final String REMINDER_QUEUE = "reminder.queue";
    public static final String REMINDER_EXCHANGE = "reminder.exchange";
    @Bean
    public Queue myQueue() {
        return new Queue("scar.queue", true);
    }

    @Bean
    public Queue reminderQueue() {
        return QueueBuilder.durable(REMINDER_QUEUE).build();
    }

    @Bean
    public CustomExchange reminderExchange() {
        Map<String, Object> args = new HashMap<>();
        args.put("x-delayed-type", "direct");
        return new CustomExchange("reminder.exchange", "x-delayed-message", true, false, args);
    }


    @Bean
    public Binding bindingReminderQueue(Queue reminderQueue, CustomExchange reminderExchange) {
        return BindingBuilder.bind(reminderQueue).to(reminderExchange).with(REMINDER_QUEUE).noargs();
    }

    @Bean
    public Jackson2JsonMessageConverter jsonMessageConverter() {
        Jackson2JsonMessageConverter converter = new Jackson2JsonMessageConverter();
        // Cho phép deserialization của HashMap (nếu cần)
        converter.setClassMapper(new DefaultClassMapper());
        return converter;
    }
}
