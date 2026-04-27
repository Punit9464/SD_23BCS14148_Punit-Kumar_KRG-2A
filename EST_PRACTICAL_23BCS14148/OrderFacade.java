interface Payment {
    void pay(int amount);
}

class UPIPayment implements Payment {
    public void pay(int amount) {
        System.out.println("UPI Payments");
    }
};

class EmailService {
    public void sendConfirmationEmail(String message) {
        System.out.println("Email sent: " + message);
    }
}

class Warehouse {
    public void prepareOrder(String item) {
        System.out.println("Warehouse: Preparing order for " + item);
    }
}

public class OrderFacade {
    private Payment payment;
    private EmailService emailService;
    private Warehouse warehouse;

    public OrderFacade() {
        this.payment = new UPIPayment();
        this.emailService = new EmailService();
        this.warehouse = new Warehouse();
    }

    public void placeOrder(String item, int amount) {
        System.out.println("OrderFacade: Placing order for " + item);
        payment.pay(amount);
        warehouse.prepareOrder(item);
        emailService.sendConfirmationEmail("Order placed for " + item);
        System.out.println("OrderFacade: Order completed\n");
    }

    public static void main(String[] args) {
        OrderFacade facade = new OrderFacade();
        facade.placeOrder("Laptop", 50000);
        facade.placeOrder("Phone", 20000);
    }
}
