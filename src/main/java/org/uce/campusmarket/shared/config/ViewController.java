package org.uce.campusmarket.shared.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

    @GetMapping({
            "/",
            "/index"
    })
    public String index() {
        return "forward:/index.html";
    }

    @GetMapping({
            "/sign-in",
            "/sign-in/**"
    })
    public String signIn() {
        return "forward:/signin.html";
    }

    @GetMapping({
            "/sign-up",
            "/sign-up/**"
    })
    public String signUp() {
        return "forward:/signup.html";
    }

    @GetMapping("/dashboard")
    public String dashboard() {
        return "forward:/dashboard.html";
    }

}