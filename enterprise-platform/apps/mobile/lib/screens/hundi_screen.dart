import 'package:flutter/material.dart';

class HundiScreen extends StatefulWidget {
  const HundiScreen({super.key});

  @override
  State<HundiScreen> createState() => _HundiScreenState();
}

class _HundiScreenState extends State<HundiScreen> {
  int _selectedAmount = 1008;
  final TextEditingController _customAmountController = TextEditingController();
  final TextEditingController _nameController = TextEditingController(text: 'Sri Devotee');
  final TextEditingController _panController = TextEditingController();
  bool _is80GRequested = true;

  final List<int> _quickAmounts = [501, 1008, 2500, 5000, 10000];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('డిజిటల్ ఇ-హుండి • E-Hundi Portal'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.amber.shade50,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.amber.shade300),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFF8B0000),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.savings, color: Color(0xFFFFD700), size: 32),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Text(
                          'Sacred Mandir Construction E-Hundi',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                            color: Color(0xFF4A0404),
                          ),
                        ),
                        SizedBox(height: 4),
                        Text(
                          '100% Tax Exempted under Section 80G of IT Act',
                          style: TextStyle(
                            fontSize: 11,
                            color: Color(0xFFD97706),
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Amount Selector Title
            const Text(
              'Select Donation Amount (₹)',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 15,
                color: Color(0xFF4A0404),
              ),
            ),
            const SizedBox(height: 12),

            // Quick Amount Chips
            Wrap(
              spacing: 10,
              runSpacing: 10,
              children: _quickAmounts.map((amount) {
                final isSelected = _selectedAmount == amount;
                return ChoiceChip(
                  label: Text('₹$amount'),
                  selected: isSelected,
                  onSelected: (selected) {
                    if (selected) {
                      setState(() {
                        _selectedAmount = amount;
                        _customAmountController.clear();
                      });
                    }
                  },
                  selectedColor: const Color(0xFF8B0000),
                  backgroundColor: Colors.white,
                  labelStyle: TextStyle(
                    color: isSelected ? Colors.white : const Color(0xFF4A0404),
                    fontWeight: FontWeight.bold,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                    side: BorderSide(
                      color: isSelected ? const Color(0xFF8B0000) : Colors.amber.shade300,
                    ),
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 16),

            // Custom Amount Input
            TextField(
              controller: _customAmountController,
              keyboardType: TextInputType.number,
              decoration: InputDecoration(
                labelText: 'Or enter custom amount (₹)',
                prefixIcon: const Icon(Icons.currency_rupee, color: Color(0xFF8B0000)),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: Color(0xFF8B0000), width: 2),
                ),
              ),
              onChanged: (val) {
                if (val.isNotEmpty) {
                  setState(() {
                    _selectedAmount = int.tryParse(val) ?? 0;
                  });
                }
              },
            ),
            const SizedBox(height: 20),

            // Devotee Details Title
            const Text(
              'Devotee Information',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 15,
                color: Color(0xFF4A0404),
              ),
            ),
            const SizedBox(height: 12),

            // Devotee Name
            TextField(
              controller: _nameController,
              decoration: InputDecoration(
                labelText: 'Full Name',
                prefixIcon: const Icon(Icons.person, color: Color(0xFF8B0000)),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
            const SizedBox(height: 12),

            // 80G Tax Checkbox
            CheckboxListTile(
              value: _is80GRequested,
              onChanged: (val) {
                setState(() {
                  _is80GRequested = val ?? true;
                });
              },
              title: const Text(
                'I require an 80G Tax Exemption Certificate',
                style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
              ),
              activeColor: const Color(0xFF8B0000),
              contentPadding: EdgeInsets.zero,
            ),

            if (_is80GRequested) ...[
              const SizedBox(height: 4),
              TextField(
                controller: _panController,
                textCapitalization: TextCapitalization.characters,
                decoration: InputDecoration(
                  labelText: 'PAN Card Number (e.g. ABCDE1234F)',
                  prefixIcon: const Icon(Icons.badge, color: Color(0xFF8B0000)),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
            ],
            const SizedBox(height: 24),

            // Checkout Button
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton.icon(
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('Launching Razorpay UPI/Netbanking for ₹$_selectedAmount...'),
                      backgroundColor: const Color(0xFF8B0000),
                    ),
                  );
                },
                icon: const Icon(Icons.lock_clock, color: Color(0xFFFFD700)),
                label: Text(
                  'Proceed to Pay ₹$_selectedAmount via Razorpay',
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 15,
                  ),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF8B0000),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  elevation: 4,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
