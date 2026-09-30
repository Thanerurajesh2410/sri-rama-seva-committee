import 'package:flutter/material.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('భక్తుడి ప్రొఫైల్ • Devotee Profile'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // Devotee Digital Pass Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF4A0404), Color(0xFF8B0000)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.15),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      Row(
                        children: const [
                          Icon(Icons.stars, color: Color(0xFFFFD700), size: 24),
                          SizedBox(width: 8),
                          Text(
                            'DEVOTEE DIGITAL PASS',
                            style: TextStyle(
                              color: Color(0xFFFFD700),
                              fontWeight: FontWeight.bold,
                              fontSize: 12,
                              letterSpacing: 1,
                            ),
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.amber.shade700,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Text(
                          'VIP PATRON',
                          style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  Row(
                    children: [
                      CircleAvatar(
                        radius: 30,
                        backgroundColor: Colors.amber.shade200,
                        child: const Text(
                          'SR',
                          style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF4A0404), fontSize: 20),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: const [
                            Text(
                              'Sri Rajesh Thaneeru',
                              style: TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 18,
                              ),
                            ),
                            SizedBox(height: 2),
                            Text(
                              'Gotram: Kasyapa • Nakshatram: Rohini',
                              style: TextStyle(color: Colors.white70, fontSize: 12),
                            ),
                            Text(
                              'Devotee ID: #SRK-2026-9912',
                              style: TextStyle(color: Color(0xFFFFD700), fontSize: 11, fontWeight: FontWeight.w600),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Past Donations & 80G Certificates List
            const Align(
              alignment: Alignment.centerLeft,
              child: Text(
                'Donation History & 80G Tax Certificates',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 15,
                  color: Color(0xFF4A0404),
                ),
              ),
            ),
            const SizedBox(height: 12),

            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: ListView(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                children: [
                  ListTile(
                    leading: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.amber.shade100,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.receipt_long, color: Color(0xFF8B0000)),
                    ),
                    title: const Text(
                      '₹25,000 • Mandir Construction',
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                    ),
                    subtitle: const Text('30 Sep 2026 • 80G Receipt #RSK-2026-881'),
                    trailing: TextButton.icon(
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Downloading 80G Tax Receipt PDF...')),
                        );
                      },
                      icon: const Icon(Icons.download, size: 16, color: Color(0xFF8B0000)),
                      label: const Text('PDF', style: TextStyle(color: Color(0xFF8B0000))),
                    ),
                  ),
                  const Divider(height: 1),
                  ListTile(
                    leading: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.amber.shade100,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.receipt_long, color: Color(0xFF8B0000)),
                    ),
                    title: const Text(
                      '₹5,001 • E-Hundi Contribution',
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                    ),
                    subtitle: const Text('15 Aug 2026 • 80G Receipt #RSK-2026-442'),
                    trailing: TextButton.icon(
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Downloading 80G Tax Receipt PDF...')),
                        );
                      },
                      icon: const Icon(Icons.download, size: 16, color: Color(0xFF8B0000)),
                      label: const Text('PDF', style: TextStyle(color: Color(0xFF8B0000))),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Settings & Preferences
            const Align(
              alignment: Alignment.centerLeft,
              child: Text(
                'Notification Preferences',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 15,
                  color: Color(0xFF4A0404),
                ),
              ),
            ),
            const SizedBox(height: 12),

            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: Column(
                children: [
                  SwitchListTile(
                    value: true,
                    onChanged: (val) {},
                    title: const Text('Daily Morning Live Darshan Alert', style: TextStyle(fontSize: 13)),
                    subtitle: const Text('Notify 10 minutes before 6:00 AM Abhishekam', style: TextStyle(fontSize: 11)),
                    activeColor: const Color(0xFF8B0000),
                  ),
                  const Divider(height: 1),
                  SwitchListTile(
                    value: true,
                    onChanged: (val) {},
                    title: const Text('Monthly Ekadashi & Festival Reminders', style: TextStyle(fontSize: 13)),
                    subtitle: const Text('Special puja dates & fastings', style: TextStyle(fontSize: 11)),
                    activeColor: const Color(0xFF8B0000),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
