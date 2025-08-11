package v25;

import io.javalin.Javalin;
import java.sql.*;

public class Main {

    private static final String URL  = "jdbc:mysql://localhost:3306/pageturners?allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC";
    private static final String USER = "demo";
    private static final String PASS = "demo123";

    public static void main(String[] args) throws Exception {

        // Test DB connection
        try (Connection conn = DriverManager.getConnection(URL, USER, PASS)) {
            System.out.println("[OK] MySQL connected");
        }

        var app = Javalin.create().start(3000);

        // POST /order?customerId=1
        app.post("/order", ctx -> {
            long customerId = Long.parseLong(ctx.queryParam("customerId"));

            try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
                 PreparedStatement ps = conn.prepareStatement(
                         "INSERT INTO `order` (customer_id, order_date, status) VALUES (?, NOW(), 'PENDING')",
                         Statement.RETURN_GENERATED_KEYS)) {

                ps.setLong(1, customerId);
                ps.executeUpdate();

                try (ResultSet keys = ps.getGeneratedKeys()) {
                    if (keys.next()) {
                        long orderId = keys.getLong(1);
                        ctx.result("Created order ID: " + orderId);
                    } else {
                        ctx.result("Order inserted but no ID returned");
                    }
                }

            } catch (SQLException e) {
                e.printStackTrace();
                ctx.result("Error: " + e.getMessage());
            }
        });






        // GET /book?id=...
        app.get("/book", ctx -> {
            long id = Long.parseLong(ctx.queryParam("id"));
            try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
                 PreparedStatement ps = conn.prepareStatement(
                         "SELECT title, price, stock_quantity FROM book WHERE book_id=?")) {
                ps.setLong(1, id);
                try (ResultSet rs = ps.executeQuery()) {
                    if (rs.next()) {
                        ctx.result("Title: " + rs.getString("title") +
                                ", Price: " + rs.getBigDecimal("price") +
                                ", Stock: " + rs.getInt("stock_quantity"));
                    } else {
                        ctx.result("Book not found");
                    }
                }
            }
        });

        // GET /customer?id=...
        app.get("/customer", ctx -> {
            long id = Long.parseLong(ctx.queryParam("id"));
            try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
                 PreparedStatement ps = conn.prepareStatement(
                         "SELECT name, email, registration_date FROM customer WHERE customer_id=?")) {
                ps.setLong(1, id);
                try (ResultSet rs = ps.executeQuery()) {
                    if (rs.next()) {
                        ctx.result("Name: " + rs.getString("name") +
                                ", Email: " + rs.getString("email") +
                                ", Registered: " + rs.getDate("registration_date"));
                    } else {
                        ctx.result("Customer not found");
                    }
                }
            }
        });
    }
}
