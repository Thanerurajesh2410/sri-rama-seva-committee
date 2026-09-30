import 'package:flutter/material.dart';

class SevaBookingScreen extends StatefulWidget {
  const SevaBookingScreen({super.key});

  @override
  State<SevaBookingScreen> createState() => _SevaBookingScreenState();
}

class _SevaBookingScreenState extends State<SevaBookingScreen> {
  String _selectedSevaId = 'SEVA-102';
  DateTime _selectedDate = DateTime.now().add(const Duration(days: 1));
  final TextEditingController _gotramController = TextEditingController();
  final TextEditingController _nakshatramController = TextEditingController();
  bool _isPrasadDeliveryRequested = true;

  final List<Map<String, dynamic>> _sevas = [
    {
      'id': 'SEVA-101',
      'title': 'Nithya Archana & Ashtottaram',
      'price': 251,
      'description': 'Daily morning archana in your name with gotram and nakshatram chantings.',
      'icon': Icons.spa,
    },
    {
      'id': 'SEVA-102',
      'title': 'Sri Sita Rama Swamy Kalyanam',
      'price': 1116,
      'description': 'Grand celestial marriage ceremony for divine blessings of family prosperity.',
      'icon': Icons.favorite,
    },
    {
      'id': 'SEVA-103',
      'title': 'Annadhanam Seva (1 Day Sponsorship)',
      'price': 5000,
      'description': 'Sponsor full day holy meals for 200+ visiting devotees & sadhus.',
      'icon': Icons.restaurant,
    },
    {
      'id': 'SEVA-104',
      'title': 'Saswatha Nithya Puja Endowment',
      'price': 10008,
      'description': 'Perpetual annual puja performed on your chosen birthday/anniversary date.',
      'icon': Icons.workspace_premium,
    },
  ];

  @override
  Widget build(BuildContext context) {
    final activeSeva = _sevas.firstWhere((s) => s['id'] == _selectedSevaId);

    return Scaffold(
      appBar: AppBar(
        title: const Text('పూజా సేవలు • Seva Booking'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Select Divine Seva',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 16,
                color: Color(0xFF4A0404),
              ),
            ),
            const SizedBox(height: 12),

            // Seva Options List
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: _sevas.length,
              separatorBuilder: (_, __) => const SizedBox(height: 10),
              itemBuilder: (context, index) {
                final seva = _sevas[index];
                final isSelected = seva['id'] == _selectedSevaId;

                return InkWell(
                  onTap: () {
                    setState(() {
                      _selectedSevaId = seva['id'];
                    });
                  },
                  borderRadius: BorderRadius.circular(12),
                  child: Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: isSelected ? const Color(0xFFFFF7E6) : Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: isSelected ? const Color(0xFFD97706) : Colors.stone.shade300,
                        width: isSelected ? 2 : 1,
                      ),
                    ),
                    child: Row(
                      children: [
                        Radio<String>(
                          value: seva['id'],
                          groupValue: _selectedSevaId,
                          onChanged: (val) {
                            if (val != null) {
                              setState(() {
                                _selectedSevaId = val;
                              });
                            }
                          },
                          activeColor: const Color(0xFF8B0000),
                        ),
                        Icon(seva['icon'] as IconData, color: const Color(0xFF8B0000), size: 28),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                seva['title'] as String,
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 14,
                                  color: Color(0xFF4A0404),
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                seva['description'] as String,
                                style: TextStyle(
                                  fontSize: 11,
                                  color: Colors.stone.shade700,
                                ),
                              ),
                            ],
                          ),
                        ),
                        Text(
                          '₹${seva['price']}',
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 15,
                            color: Color(0xFF8B0000),
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
            const SizedBox(height: 24),

            // Sankalpam Details
            const Text(
              'Sankalpam Details',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 16,
                color: Color(0xFF4A0404),
              ),
            ),
            const SizedBox(height: 12),

            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _gotramController,
                    decoration: InputDecoration(
                      labelText: 'Gotram (గోత్రము)',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: TextField(
                    controller: _nakshatramController,
                    decoration: InputDecoration(
                      labelText: 'Nakshatram (నక్షత్రము)',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // Date Picker Card
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              decoration: BoxDecoration(
                border: Border.all(color: Colors.stone.shade300),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.between,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Selected Puja Date',
                        style: TextStyle(fontSize: 11, color: Colors.grey),
                      ),
                      Text(
                        '${_selectedDate.day}/${_selectedDate.month}/${_selectedDate.year}',
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                    ],
                  ),
                  TextButton.icon(
                    onPressed: () async {
                      final picked = await showDatePicker(
                        context: context,
                        initialDate: _selectedDate,
                        firstDate: DateTime.now(),
                        lastDate: DateTime.now().add(const Duration(days: 365)),
                      );
                      if (picked != null) {
                        setState(() {
                          _selectedDate = picked;
                        });
                      }
                    },
                    icon: const Icon(Icons.calendar_today, color: Color(0xFF8B0000), size: 18),
                    label: const Text('Change Date'),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),

            CheckboxListTile(
              value: _isPrasadDeliveryRequested,
              onChanged: (val) {
                setState(() {
                  _isPrasadDeliveryRequested = val ?? true;
                });
              },
              title: const Text(
                'Deliver Speed Post Holy Prasad & Akshintalu to home address',
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600),
              ),
              activeColor: const Color(0xFF8B0000),
              contentPadding: EdgeInsets.zero,
            ),
            const SizedBox(height: 20),

            // Book Button
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(
                        'Seva Booking confirmed for ${activeSeva['title']} on ${_selectedDate.day}/${_selectedDate.month}/${_selectedDate.year}',
                      ),
                      backgroundColor: const Color(0xFF8B0000),
                    ),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF8B0000),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: Text(
                  'Book Seva • ₹${activeSeva['price']}',
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
