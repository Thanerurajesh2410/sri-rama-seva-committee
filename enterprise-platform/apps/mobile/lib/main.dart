import 'package:flutter/material.dart';
import 'screens/home_screen.dart';
import 'screens/hundi_screen.dart';
import 'screens/seva_booking_screen.dart';
import 'screens/profile_screen.dart';

void main() {
  runApp(const SriRamaSevaApp());
}

class SriRamaSevaApp extends StatelessWidget {
  const SriRamaSevaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Sri Rama Seva Committee',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF8B0000), // Deep Crimson / Temple Red
          primary: const Color(0xFF8B0000),
          secondary: const Color(0xFFD97706), // Saffron Amber
          surface: const Color(0xFFFFFDF7),
          background: const Color(0xFFFFFDF5),
        ),
        scaffoldBackgroundColor: const Color(0xFFFFFDF5),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF4A0404),
          foregroundColor: Colors.white,
          centerTitle: true,
          elevation: 2,
        ),
      ),
      home: const MainNavigationShell(),
    );
  }
}

class MainNavigationShell extends StatefulWidget {
  const MainNavigationShell({super.key});

  @override
  State<MainNavigationShell> createState() => _MainNavigationShellState();
}

class _MainNavigationShellState extends State<MainNavigationShell> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    HomeScreen(),
    HundiScreen(),
    SevaBookingScreen(),
    ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 10,
              offset: const Offset(0, -3),
            ),
          ],
        ),
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: (index) {
            setState(() {
              _currentIndex = index;
            });
          },
          type: BottomNavigationBarType.fixed,
          backgroundColor: const Color(0xFF4A0404),
          selectedItemColor: const Color(0xFFFFD700), // Sacred Gold
          unselectedItemColor: Colors.white60,
          selectedLabelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
          unselectedLabelStyle: const TextStyle(fontSize: 11),
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.temple_hindu),
              activeIcon: Icon(Icons.temple_hindu, color: Color(0xFFFFD700)),
              label: 'Darshan',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.volunteer_activism),
              activeIcon: Icon(Icons.volunteer_activism, color: Color(0xFFFFD700)),
              label: 'E-Hundi',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.cleaning_services),
              activeIcon: Icon(Icons.cleaning_services, color: Color(0xFFFFD700)),
              label: 'Puja Seva',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.person_pin),
              activeIcon: Icon(Icons.person_pin, color: Color(0xFFFFD700)),
              label: 'Devotee ID',
            ),
          ],
        ),
      ),
    );
  }
}
