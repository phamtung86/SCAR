package com.t2.controller;

import com.t2.service.IAppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/appointments")
public class AppointmentController {

    @Autowired
    private IAppointmentService iAppointmentService;

    @GetMapping("/confirm")
    public void updateStatusConfirm(@RequestParam(name = "id") Integer id, @RequestParam(name = "user") Integer userId) {
        System.out.println("CONFIRM");
        iAppointmentService.updateStatus(id, "CONFIRMED");
    }

    @GetMapping("/cancel")
    public void updateStatusCancel(@RequestParam(name = "id") Integer id, @RequestParam(name = "user") Integer userId) {
        System.out.println("CANCEL");
        iAppointmentService.updateStatus(id, "CANCELED");
    }
}
