import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    # 16:9 Widescreen dimensions
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6] # completely blank layout

    # Color Palette
    BURGUNDY = RGBColor(122, 31, 31)      # #7a1f1f
    GOLD = RGBColor(197, 140, 31)         # #c58c1f
    DARK_NAVY = RGBColor(15, 23, 42)      # #0f172a
    SLATE = RGBColor(51, 65, 85)          # #334155
    MUTED = RGBColor(100, 116, 139)       # #64748b
    WHITE = RGBColor(255, 255, 255)
    LIGHT_BG = RGBColor(250, 248, 245)    # #faf8f5
    CARD_BG = RGBColor(255, 255, 255)
    CARD_BORDER = RGBColor(232, 226, 216)
    CARD_ACCENT_BG = RGBColor(254, 249, 238)
    GREEN = RGBColor(22, 101, 52)
    HEADER_BAR = RGBColor(122, 31, 31)

    def add_header(slide, title_text, category_text="SPICE ROUTE — CLOUD COMPUTING ARCHITECTURE"):
        # Header bar
        header_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.733), Inches(1.1))
        tf = header_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

        p_cat = tf.paragraphs[0]
        p_cat.text = category_text.upper()
        p_cat.font.name = "Arial"
        p_cat.font.size = Pt(10)
        p_cat.font.bold = True
        p_cat.font.color.rgb = GOLD
        p_cat.space_after = Pt(4)

        p_title = tf.add_paragraph()
        p_title.text = title_text
        p_title.font.name = "Arial"
        p_title.font.size = Pt(24)
        p_title.font.bold = True
        p_title.font.color.rgb = BURGUNDY

        # Subtle divider line
        line = slide.shapes.add_shape(
            MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.5), Inches(11.733), Inches(0.02)
        )
        line.fill.solid()
        line.fill.fore_color.rgb = CARD_BORDER
        line.line.color.rgb = CARD_BORDER

    def add_speaker_cue(slide, cue_text):
        cue_box = slide.shapes.add_shape(
            MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.4), Inches(11.733), Inches(0.7)
        )
        cue_box.fill.solid()
        cue_box.fill.fore_color.rgb = CARD_ACCENT_BG
        cue_box.line.color.rgb = GOLD
        cue_box.line.width = Pt(1)

        tf = cue_box.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.2)
        tf.margin_top = Inches(0.1)
        tf.margin_right = Inches(0.2)
        tf.margin_bottom = Inches(0.1)

        p = tf.paragraphs[0]
        p.text = "💡 Speaker Cue (What to say): " + cue_text
        p.font.name = "Arial"
        p.font.size = Pt(11)
        p.font.color.rgb = DARK_NAVY
        p.font.bold = False
        p.runs[0].font.bold = True

    # =========================================================================
    # SLIDE 1: Title Slide (Dark Theme)
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    bg1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = DARK_NAVY
    bg1.line.fill.background()

    # Title box
    tbox = s1.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(11.333), Inches(4.0))
    tf1 = tbox.text_frame
    tf1.word_wrap = True

    p0 = tf1.paragraphs[0]
    p0.text = "AWS CLOUD COMPUTING CAPSTONE PLATFORM"
    p0.font.name = "Arial"
    p0.font.size = Pt(13)
    p0.font.bold = True
    p0.font.color.rgb = GOLD
    p0.space_after = Pt(12)

    p1 = tf1.add_paragraph()
    p1.text = "🌿 Spice Route"
    p1.font.name = "Arial"
    p1.font.size = Pt(44)
    p1.font.bold = True
    p1.font.color.rgb = WHITE
    p1.space_after = Pt(8)

    p2 = tf1.add_paragraph()
    p2.text = "Decoupled Cloud Kitchen & Smart Restaurant Management Platform"
    p2.font.name = "Arial"
    p2.font.size = Pt(20)
    p2.font.color.rgb = RGBColor(203, 213, 225)
    p2.space_after = Pt(28)

    p3 = tf1.add_paragraph()
    p3.text = "☁️ Amazon EC2 (Ubuntu)  •  🗄️ Amazon DynamoDB NoSQL  •  🪣 Amazon S3  •  ⚡ Vercel Edge  •  🔐 AWS IAM"
    p3.font.name = "Arial"
    p3.font.size = Pt(13)
    p3.font.bold = True
    p3.font.color.rgb = GOLD

    # =========================================================================
    # SLIDE 2: The Problem Statement (Why Traditional Software Fails)
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    add_header(s2, "The Real-World Problem in Restaurant Systems")

    cards_data = [
        ("💸 High Infrastructure Costs", "Monolithic on-premise servers require expensive hardware and 24/7 overprovisioning even during idle hours."),
        ("💥 Flash Rush Downtime", "Single server architectures crash during lunch/dinner peak bursts due to strict relational connection-pool limits."),
        ("🛵 Disconnected Operations", "Kitchen staff, delivery drivers, and customers lack a synchronized real-time state machine for order progression."),
        ("🥗 Dietary Blindspots", "Traditional menus lack intelligent macronutrient and allergen filtering, compromising diner safety and dietary needs.")
    ]

    for i, (head, desc) in enumerate(cards_data):
        col = i % 2
        row = i // 2
        left = Inches(0.8 + col * 5.95)
        top = Inches(1.8 + row * 2.15)
        
        card = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(5.75), Inches(1.95))
        card.fill.solid()
        card.fill.fore_color.rgb = WHITE
        card.line.color.rgb = CARD_BORDER

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = Inches(0.25)
        tf.margin_top = Inches(0.2)
        
        p = tf.paragraphs[0]
        p.text = head
        p.font.name = "Arial"
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = BURGUNDY
        p.space_after = Pt(6)

        p_desc = tf.add_paragraph()
        p_desc.text = desc
        p_desc.font.name = "Arial"
        p_desc.font.size = Pt(12)
        p_desc.font.color.rgb = SLATE

    add_speaker_cue(s2, "Explain how monolithic restaurant software fails during flash meal rushes and why decoupled cloud computing is mandatory.")

    # =========================================================================
    # SLIDE 3: Cloud Architecture (Decoupled 3-Tier)
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    add_header(s3, "Decoupled 3-Tier Cloud Architecture")

    tiers = [
        ("1. Presentation Tier", "Amazon S3 & Vercel Edge", [
            "100% static asset offloading (HTML/CSS/JS/Images)",
            "Sub-50ms global Anycast edge delivery",
            "Zero CPU drain on backend servers"
        ]),
        ("2. Compute Tier", "AWS EC2 t2.micro (Ubuntu 24.04)", [
            "Stateless Node.js / Express / TypeScript REST API",
            "PM2 supervisor for auto-restart & crash recovery",
            "Daemonized background service on Port 3000"
        ]),
        ("3. Persistence Tier", "Amazon DynamoDB NoSQL", [
            "Single-digit millisecond latency reads & writes",
            "Single-table partition keys (orderId, bookingId)",
            "On-Demand automatic horizontal scaling"
        ])
    ]

    for i, (t_title, t_tech, bullets) in enumerate(tiers):
        left = Inches(0.8 + i * 3.95)
        top = Inches(1.8)
        card = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(3.8), Inches(4.35))
        card.fill.solid()
        card.fill.fore_color.rgb = WHITE
        card.line.color.rgb = CARD_BORDER

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = Inches(0.2)
        tf.margin_top = Inches(0.2)

        p = tf.paragraphs[0]
        p.text = t_title
        p.font.name = "Arial"
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = BURGUNDY

        p_tech = tf.add_paragraph()
        p_tech.text = t_tech
        p_tech.font.name = "Arial"
        p_tech.font.size = Pt(12)
        p_tech.font.bold = True
        p_tech.font.color.rgb = GOLD
        p_tech.space_after = Pt(12)

        for b in bullets:
            pb = tf.add_paragraph()
            pb.text = "• " + b
            pb.font.name = "Arial"
            pb.font.size = Pt(11)
            pb.font.color.rgb = SLATE
            pb.space_after = Pt(6)

    add_speaker_cue(s3, "Emphasize physical separation between static web hosting and EC2 compute, ensuring high availability and zero bottlenecking.")

    # =========================================================================
    # SLIDE 4: Security & Zero-Cost Model
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    add_header(s4, "Enterprise IAM Security & Zero-Cost Cloud Architecture")

    sec_cards = [
        ("🔐 IAM Instance Profile Security", [
            "Role-Based Access Control: Attached RestaurantEC2DynamoDBRole to EC2.",
            "Zero Hardcoded Secrets: No AWS secret keys exist in codebase or .env.",
            "Automatic Token Rotation: AWS SDK fetches short-lived STS credentials via IMDS."
        ]),
        ("💰 100% AWS Free-Tier Optimized ($0.00)", [
            "Compute: AWS EC2 t2.micro (750 free hours/month covering 24/7 uptime).",
            "Database: Amazon DynamoDB (25 GB free storage + 25 RCU/WCU).",
            "Storage: Amazon S3 (5 GB free tier storage with public bucket policies)."
        ])
    ]

    for i, (title, items) in enumerate(sec_cards):
        left = Inches(0.8 + i * 5.95)
        top = Inches(1.8)
        card = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(5.75), Inches(4.35))
        card.fill.solid()
        card.fill.fore_color.rgb = WHITE
        card.line.color.rgb = CARD_BORDER

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = Inches(0.25)
        tf.margin_top = Inches(0.25)

        p = tf.paragraphs[0]
        p.text = title
        p.font.name = "Arial"
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = BURGUNDY
        p.space_after = Pt(14)

        for item in items:
            p_item = tf.add_paragraph()
            p_item.text = "✔ " + item
            p_item.font.name = "Arial"
            p_item.font.size = Pt(12)
            p_item.font.color.rgb = SLATE
            p_item.space_after = Pt(10)

    add_speaker_cue(s4, "Mention Principle of Least Privilege via IAM Roles and confirm total monthly cloud expenditure is exactly $0.00.")

    # =========================================================================
    # SLIDE 5: Core Innovations & Features
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    add_header(s5, "Key Platform Innovations & Modules")

    features = [
        ("🧠 Smart AI Dietary Sommelier", "Multi-variable knowledge graph evaluating strict Boolean exclusions (Vegan, Gluten-Free, Nut-Free, Jain), continuous calorie slider budgets, and high-protein descending sorting."),
        ("🍳 Real-Time Kitchen KDS Kanban", "Interactive 4-column state machine coordinating ticket transitions (Order Placed ➔ In Preparation ➔ Out for Delivery ➔ Delivered) with live driver dispatch telemetry."),
        ("📦 5-Stage Live Visual Tracker", "End-to-end customer order tracker with live stepper progression, assigned driver details (Name, Electric Bike, Contact), and stage simulation."),
        ("📊 CloudOps Stress Testing Engine", "In-browser load generator simulating concurrent virtual user bursts against the live EC2 instance to benchmark latency (ms), throughput (Req/s), and memory.")
    ]

    for i, (title, desc) in enumerate(features):
        col = i % 2
        row = i // 2
        left = Inches(0.8 + col * 5.95)
        top = Inches(1.8 + row * 2.15)

        card = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(5.75), Inches(1.95))
        card.fill.solid()
        card.fill.fore_color.rgb = WHITE
        card.line.color.rgb = CARD_BORDER

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = Inches(0.25)
        tf.margin_top = Inches(0.18)

        p = tf.paragraphs[0]
        p.text = title
        p.font.name = "Arial"
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = BURGUNDY
        p.space_after = Pt(4)

        p_desc = tf.add_paragraph()
        p_desc.text = desc
        p_desc.font.name = "Arial"
        p_desc.font.size = Pt(11.5)
        p_desc.font.color.rgb = SLATE

    add_speaker_cue(s5, "Highlight that our platform goes beyond ordering by integrating AI dietary safety, kitchen operations, and cloud observability.")

    # =========================================================================
    # SLIDE 6: 5-Step Live Demo Strategy
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    add_header(s6, "5-Step Live Demonstration Strategy")

    steps = [
        ("Step 1: Open Menu", "Showcase 21 curated signature pure-veg items with 1-to-1 authentic HD photography and live search."),
        ("Step 2: AI Sommelier", "Click '100% Vegan' (dairy vanishes), adjust Calorie Slider to 150 kcal, click 'High Protein'."),
        ("Step 3: Kitchen KDS", "Click 'Create Sample Ticket' ➔ click 'Accept & Cook' ➔ click 'Track Order' to show live 5-stage stepper."),
        ("Step 4: Stress Test", "Open Cloud Observability ➔ select Medium Load (30 users) ➔ execute live HTTP burst against EC2."),
        ("Step 5: EC2 Health API", "Open /health endpoint in new tab ➔ show status UP, uptime, and connected DynamoDB telemetry.")
    ]

    for i, (stitle, sdesc) in enumerate(steps):
        top = Inches(1.75 + i * 0.88)
        bar = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), top, Inches(11.733), Inches(0.76))
        bar.fill.solid()
        bar.fill.fore_color.rgb = WHITE
        bar.line.color.rgb = CARD_BORDER

        tf = bar.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.2)
        tf.margin_top = Inches(0.12)

        p = tf.paragraphs[0]
        p.text = stitle + " — "
        p.font.name = "Arial"
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = BURGUNDY

        run = p.add_run()
        run.text = sdesc
        run.font.name = "Arial"
        run.font.size = Pt(12)
        run.font.bold = False
        run.font.color.rgb = SLATE

    add_speaker_cue(s6, "Follow this exact chronological sequence during the screen share to deliver a seamless, high-scoring live demo.")

    # =========================================================================
    # SLIDE 7: Viva Defense — Part 1 (Architecture & Database)
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    add_header(s7, "Technical Viva Defense (Architecture & Database)")

    viva1 = [
        ("Q1: Why DynamoDB over MySQL / MongoDB?",
         "• Fully managed serverless NoSQL with predictable single-digit ms latency.\n• Eliminates connection pooling limits during peak dinner flash rushes.\n• Key-value single-table partition indexing (orderId, bookingId) auto-scales horizontally."),
        ("Q2: How is EC2-to-DynamoDB security enforced?",
         "• Followed AWS Principle of Least Privilege via IAM Instance Profiles.\n• EC2 AWS SDK fetches rotating temporary credentials from IMDS.\n• Zero AWS Secret Access Keys are ever hardcoded in source code."),
        ("Q3: What is the role of PM2 on EC2?",
         "• Production process supervisor keeping Node.js running as a background daemon.\n• Automatically restarts application upon uncaught exceptions or memory limits.\n• Ensures zero-downtime auto-start when the EC2 instance reboots.")
    ]

    for i, (q, a) in enumerate(viva1):
        left = Inches(0.8 + i * 3.95)
        top = Inches(1.8)
        card = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(3.8), Inches(4.35))
        card.fill.solid()
        card.fill.fore_color.rgb = WHITE
        card.line.color.rgb = CARD_BORDER

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = Inches(0.2)
        tf.margin_top = Inches(0.18)

        p = tf.paragraphs[0]
        p.text = q
        p.font.name = "Arial"
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = BURGUNDY
        p.space_after = Pt(10)

        p_ans = tf.add_paragraph()
        p_ans.text = a
        p_ans.font.name = "Arial"
        p_ans.font.size = Pt(11)
        p_ans.font.color.rgb = SLATE

    add_speaker_cue(s7, "Focus on NoSQL horizontal scalability, IAM temporary credentials, and daemonized process management.")

    # =========================================================================
    # SLIDE 8: Viva Defense — Part 2 (Decoupling & AI Engine)
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    add_header(s8, "Technical Viva Defense (Decoupling & AI Engine)")

    viva2 = [
        ("Q4: Why decouple S3 frontend from EC2?",
         "• Offloads 100% of static asset traffic (HTML, CSS, JS, Images) from server CPU.\n• Protects backend from being overwhelmed by image download traffic.\n• Enables sub-50ms edge caching across global Anycast networks."),
        ("Q5: How does the system achieve elasticity?",
         "• Backend is 100% stateless, delegating persistence to DynamoDB.\n• EC2 instance is Auto Scaling Group (ASG) ready behind an Application Load Balancer.\n• Automatically spins up new instances based on CloudWatch CPU alarms."),
        ("Q6: What makes the AI Sommelier advanced?",
         "• Combines strict Boolean dietary exclusions with continuous numeric calorie limits.\n• Evaluates macronutrients (Protein, Carbs, Fats) and allergen contraindications.\n• Provides instant clinical reasoning explaining why each dish is safe.")
    ]

    for i, (q, a) in enumerate(viva2):
        left = Inches(0.8 + i * 3.95)
        top = Inches(1.8)
        card = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(3.8), Inches(4.35))
        card.fill.solid()
        card.fill.fore_color.rgb = WHITE
        card.line.color.rgb = CARD_BORDER

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = Inches(0.2)
        tf.margin_top = Inches(0.18)

        p = tf.paragraphs[0]
        p.text = q
        p.font.name = "Arial"
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = BURGUNDY
        p.space_after = Pt(10)

        p_ans = tf.add_paragraph()
        p_ans.text = a
        p_ans.font.name = "Arial"
        p_ans.font.size = Pt(11)
        p_ans.font.color.rgb = SLATE

    add_speaker_cue(s8, "Demonstrate clear mastery of edge CDN caching, stateless horizontal scaling, and multi-variable AI filtering.")

    # =========================================================================
    # SLIDE 9: Live Cloud Deployment Endpoints
    # =========================================================================
    s9 = prs.slides.add_slide(blank_layout)
    add_header(s9, "Live Production Endpoints & Cloud Verification")

    endpoints = [
        ("⚡ Global Production Frontend", "Vercel Global Edge Network (HTTPS SSL)", "https://spice-route-restaurant-flame.vercel.app/"),
        ("🪣 AWS Storage Website Tier", "Amazon S3 Static Website Hosting (ap-south-1)", "http://spice-route-restaurant-lakshi-2026.s3-website.ap-south-1.amazonaws.com/"),
        ("💻 Compute REST API", "Amazon EC2 t2.micro Linux Instance", "http://65.0.105.182:3000/"),
        ("🩺 Live Cloud Health Probe", "Real-Time Telemetry & Process Monitor", "http://65.0.105.182:3000/health")
    ]

    for i, (title, tech, url) in enumerate(endpoints):
        top = Inches(1.75 + i * 1.1)
        box = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), top, Inches(11.733), Inches(0.95))
        box.fill.solid()
        box.fill.fore_color.rgb = WHITE
        box.line.color.rgb = CARD_BORDER

        tf = box.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.25)
        tf.margin_top = Inches(0.14)

        p = tf.paragraphs[0]
        p.text = title + "  •  " + tech
        p.font.name = "Arial"
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = BURGUNDY
        p.space_after = Pt(3)

        p_url = tf.add_paragraph()
        p_url.text = "🔗 " + url
        p_url.font.name = "Courier New"
        p_url.font.size = Pt(11)
        p_url.font.bold = True
        p_url.font.color.rgb = GOLD

    add_speaker_cue(s9, "Point to these live links to show faculty that your application is 100% deployed and running across multiple cloud tiers.")

    # =========================================================================
    # SLIDE 10: Conclusion & Summary
    # =========================================================================
    s10 = prs.slides.add_slide(blank_layout)
    bg10 = s10.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg10.fill.solid()
    bg10.fill.fore_color.rgb = DARK_NAVY
    bg10.line.fill.background()

    tbox10 = s10.shapes.add_textbox(Inches(1.0), Inches(1.6), Inches(11.333), Inches(4.5))
    tf10 = tbox10.text_frame
    tf10.word_wrap = True

    p0 = tf10.paragraphs[0]
    p0.text = "PROJECT SUMMARY & CONCLUSION"
    p0.font.name = "Arial"
    p0.font.size = Pt(13)
    p0.font.bold = True
    p0.font.color.rgb = GOLD
    p0.space_after = Pt(12)

    p1 = tf10.add_paragraph()
    p1.text = "🌿 Spice Route Cloud Platform"
    p1.font.name = "Arial"
    p1.font.size = Pt(36)
    p1.font.bold = True
    p1.font.color.rgb = WHITE
    p1.space_after = Pt(20)

    p2 = tf10.add_paragraph()
    p2.text = "✔ Decoupled 3-Tier Architecture ensures sub-50ms static delivery and isolated compute elasticity."
    p2.font.name = "Arial"
    p2.font.size = Pt(15)
    p2.font.color.rgb = RGBColor(226, 232, 240)
    p2.space_after = Pt(10)

    p3 = tf10.add_paragraph()
    p3.text = "✔ Amazon DynamoDB eliminates flash-rush connection pool bottlenecks with on-demand scaling."
    p3.font.name = "Arial"
    p3.font.size = Pt(15)
    p3.font.color.rgb = RGBColor(226, 232, 240)
    p3.space_after = Pt(10)

    p4 = tf10.add_paragraph()
    p4.text = "✔ Enterprise IAM security with zero hardcoded credentials and 100% AWS Free-Tier compliance ($0.00)."
    p4.font.name = "Arial"
    p4.font.size = Pt(15)
    p4.font.color.rgb = RGBColor(226, 232, 240)
    p4.space_after = Pt(28)

    p5 = tf10.add_paragraph()
    p5.text = "✨ Thank you! We are now open for faculty questions and discussion."
    p5.font.name = "Arial"
    p5.font.size = Pt(18)
    p5.font.bold = True
    p5.font.color.rgb = GOLD

    output_path = os.path.abspath("Spice_Route_Cloud_Presentation.pptx")
    prs.save(output_path)
    print(f"Presentation saved successfully to: {output_path}")

if __name__ == "__main__":
    create_deck()
