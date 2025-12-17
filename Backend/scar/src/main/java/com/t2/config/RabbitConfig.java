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

    public static final String CAR_QUEUE = "car.created.queue";
    public static final String CAR_EXCHANGE = "car.exchange";
    public static final String CAR_ROUTING_KEY = "car.created";

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

        // Configure trusted packages for deserialization
        DefaultClassMapper classMapper = new DefaultClassMapper();
        classMapper.setTrustedPackages("com.t2.dto", "com.t2", "java.util", "java.lang");

        converter.setClassMapper(classMapper);
        return converter;
    }

    @Bean
    public Queue carQueue() {
        return QueueBuilder.durable(CAR_QUEUE)
                .withArgument("x-message-ttl", 86400000)
                .build();
    }

    @Bean
    public TopicExchange carExchange() {
        return new TopicExchange(CAR_EXCHANGE, true, false);
    }

    @Bean
    public Binding bindingCarQueue(Queue carQueue, TopicExchange carExchange) {
        return BindingBuilder.bind(carQueue).to(carExchange).with(CAR_ROUTING_KEY);
    }

}
