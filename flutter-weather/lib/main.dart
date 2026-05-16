import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

void main() {
  runApp(const WeatherApp());
}

class WeatherApp extends StatelessWidget {
  const WeatherApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Weather',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF0F766E),
          brightness: Brightness.light,
        ),
        useMaterial3: true,
      ),
      home: const WeatherHomePage(),
    );
  }
}

class WeatherHomePage extends StatefulWidget {
  const WeatherHomePage({super.key});

  @override
  State<WeatherHomePage> createState() => _WeatherHomePageState();
}

class _WeatherHomePageState extends State<WeatherHomePage> {
  final TextEditingController _controller = TextEditingController(text: 'Berlin');
  Future<WeatherReport>? _weatherFuture;

  @override
  void initState() {
    super.initState();
    _weatherFuture = WeatherService.fetchWeather(_controller.text);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _search() {
    final query = _controller.text.trim();
    if (query.isEmpty) {
      return;
    }

    setState(() {
      _weatherFuture = WeatherService.fetchWeather(query);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFFE0F2FE), Color(0xFFF0FDF4)],
          ),
        ),
        child: SafeArea(
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 980),
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const _Header(),
                    const SizedBox(height: 24),
                    _SearchBar(
                      controller: _controller,
                      onSubmitted: _search,
                    ),
                    const SizedBox(height: 24),
                    Expanded(
                      child: FutureBuilder<WeatherReport>(
                        future: _weatherFuture,
                        builder: (context, snapshot) {
                          if (snapshot.connectionState == ConnectionState.waiting) {
                            return const _LoadingCard();
                          }

                          if (snapshot.hasError) {
                            return _MessageCard(
                              title: 'Could not load weather',
                              message: snapshot.error.toString(),
                              icon: Icons.cloud_off_outlined,
                            );
                          }

                          final report = snapshot.data;
                          if (report == null) {
                            return const _MessageCard(
                              title: 'Search for a city',
                              message: 'Enter a location to see the current weather conditions.',
                              icon: Icons.search,
                            );
                          }

                          return _WeatherPanel(report: report);
                        },
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _Header extends StatelessWidget {
  const _Header();

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Flutter for Web',
          style: textTheme.labelLarge?.copyWith(
            color: const Color(0xFF0F766E),
            fontWeight: FontWeight.w800,
            letterSpacing: 0,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          'Weather App',
          style: textTheme.displayMedium?.copyWith(
            color: const Color(0xFF102A43),
            fontWeight: FontWeight.w800,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          'Search for a city and view live conditions from the free Open-Meteo API.',
          style: textTheme.titleMedium?.copyWith(color: const Color(0xFF486581)),
        ),
      ],
    );
  }
}

class _SearchBar extends StatelessWidget {
  const _SearchBar({
    required this.controller,
    required this.onSubmitted,
  });

  final TextEditingController controller;
  final VoidCallback onSubmitted;

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 0,
      color: Colors.white,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
      child: Padding(
        padding: const EdgeInsets.all(10),
        child: Row(
          children: [
            Expanded(
              child: TextField(
                controller: controller,
                textInputAction: TextInputAction.search,
                onSubmitted: (_) => onSubmitted(),
                decoration: const InputDecoration(
                  border: InputBorder.none,
                  prefixIcon: Icon(Icons.location_on_outlined),
                  hintText: 'Try London, Tokyo, Lagos...',
                ),
              ),
            ),
            FilledButton.icon(
              onPressed: onSubmitted,
              icon: const Icon(Icons.search),
              label: const Text('Search'),
            ),
          ],
        ),
      ),
    );
  }
}

class _WeatherPanel extends StatelessWidget {
  const _WeatherPanel({required this.report});

  final WeatherReport report;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final isWide = constraints.maxWidth >= 760;

        if (!isWide) {
          return SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                _CurrentWeatherCard(report: report),
                const SizedBox(height: 18),
                _DetailsCard(report: report),
              ],
            ),
          );
        }

        return SingleChildScrollView(
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                flex: 3,
                child: _CurrentWeatherCard(report: report),
              ),
              const SizedBox(width: 18),
              Expanded(
                flex: 2,
                child: _DetailsCard(report: report),
              ),
            ],
          ),
        );
      },
    );
  }
}

class _CurrentWeatherCard extends StatelessWidget {
  const _CurrentWeatherCard({required this.report});

  final WeatherReport report;

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    return Card(
      elevation: 0,
      color: Colors.white,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
      child: Padding(
        padding: const EdgeInsets.all(28),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              report.placeLabel,
              style: textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.w800,
                color: const Color(0xFF102A43),
              ),
            ),
            const SizedBox(height: 12),
            Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Icon(
                  report.condition.icon,
                  size: 72,
                  color: const Color(0xFF0F766E),
                ),
                const SizedBox(width: 20),
                Text(
                  '${report.temperature.round()}°C',
                  style: textTheme.displayLarge?.copyWith(
                    fontWeight: FontWeight.w900,
                    color: const Color(0xFF102A43),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              report.condition.label,
              style: textTheme.titleLarge?.copyWith(color: const Color(0xFF486581)),
            ),
            const SizedBox(height: 28),
            Text(
              'Updated ${report.observationTime}',
              style: textTheme.bodyMedium?.copyWith(color: const Color(0xFF627D98)),
            ),
          ],
        ),
      ),
    );
  }
}

class _DetailsCard extends StatelessWidget {
  const _DetailsCard({required this.report});

  final WeatherReport report;

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 0,
      color: Colors.white.withValues(alpha: 0.92),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            _DetailRow(
              icon: Icons.air,
              label: 'Wind',
              value: '${report.windSpeed.toStringAsFixed(1)} km/h',
            ),
            const Divider(height: 28),
            _DetailRow(
              icon: Icons.navigation_outlined,
              label: 'Direction',
              value: '${report.windDirection.round()}°',
            ),
            const Divider(height: 28),
            _DetailRow(
              icon: Icons.water_drop_outlined,
              label: 'Humidity',
              value: report.humidity == null ? 'Not reported' : '${report.humidity!.round()}%',
            ),
            const Divider(height: 28),
            _DetailRow(
              icon: Icons.public,
              label: 'Coordinates',
              value:
                  '${report.latitude.toStringAsFixed(2)}, ${report.longitude.toStringAsFixed(2)}',
            ),
          ],
        ),
      ),
    );
  }
}

class _DetailRow extends StatelessWidget {
  const _DetailRow({
    required this.icon,
    required this.label,
    required this.value,
  });

  final IconData icon;
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, color: const Color(0xFF0F766E)),
        const SizedBox(width: 14),
        Expanded(
          child: Text(
            label,
            style: const TextStyle(
              color: Color(0xFF486581),
              fontWeight: FontWeight.w700,
            ),
          ),
        ),
        Text(
          value,
          style: const TextStyle(
            color: Color(0xFF102A43),
            fontWeight: FontWeight.w800,
          ),
        ),
      ],
    );
  }
}

class _LoadingCard extends StatelessWidget {
  const _LoadingCard();

  @override
  Widget build(BuildContext context) {
    return const _MessageCard(
      title: 'Fetching weather',
      message: 'Looking up the latest conditions...',
      icon: Icons.sync,
      showProgress: true,
    );
  }
}

class _MessageCard extends StatelessWidget {
  const _MessageCard({
    required this.title,
    required this.message,
    required this.icon,
    this.showProgress = false,
  });

  final String title;
  final String message;
  final IconData icon;
  final bool showProgress;

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 0,
      color: Colors.white,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
      child: Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(icon, size: 54, color: const Color(0xFF0F766E)),
              const SizedBox(height: 16),
              Text(
                title,
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      color: const Color(0xFF102A43),
                      fontWeight: FontWeight.w800,
                    ),
              ),
              const SizedBox(height: 8),
              Text(
                message,
                textAlign: TextAlign.center,
                style: const TextStyle(color: Color(0xFF486581)),
              ),
              if (showProgress) ...[
                const SizedBox(height: 24),
                const CircularProgressIndicator(),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

class WeatherService {
  static Future<WeatherReport> fetchWeather(String city) async {
    final geocodeUri = Uri.https('geocoding-api.open-meteo.com', '/v1/search', {
      'name': city,
      'count': '1',
      'language': 'en',
      'format': 'json',
    });

    final geocodeResponse = await http.get(geocodeUri);
    if (geocodeResponse.statusCode != 200) {
      throw Exception('Location lookup failed. Please try again.');
    }

    final geocodeJson = jsonDecode(geocodeResponse.body) as Map<String, dynamic>;
    final results = geocodeJson['results'] as List<dynamic>?;
    if (results == null || results.isEmpty) {
      throw Exception('No matching location found for "$city".');
    }

    final location = results.first as Map<String, dynamic>;
    final latitude = (location['latitude'] as num).toDouble();
    final longitude = (location['longitude'] as num).toDouble();
    final name = location['name'] as String;
    final country = location['country'] as String? ?? '';
    final admin = location['admin1'] as String?;

    final weatherUri = Uri.https('api.open-meteo.com', '/v1/forecast', {
      'latitude': latitude.toString(),
      'longitude': longitude.toString(),
      'current': 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m',
      'timezone': 'auto',
    });

    final weatherResponse = await http.get(weatherUri);
    if (weatherResponse.statusCode != 200) {
      throw Exception('Weather lookup failed. Please try again.');
    }

    final weatherJson = jsonDecode(weatherResponse.body) as Map<String, dynamic>;
    final current = weatherJson['current'] as Map<String, dynamic>;

    return WeatherReport(
      placeLabel: [name, admin, country].where((part) => part != null && part.isNotEmpty).join(', '),
      latitude: latitude,
      longitude: longitude,
      temperature: (current['temperature_2m'] as num).toDouble(),
      humidity: (current['relative_humidity_2m'] as num?)?.toDouble(),
      windSpeed: (current['wind_speed_10m'] as num).toDouble(),
      windDirection: (current['wind_direction_10m'] as num).toDouble(),
      observationTime: current['time'] as String,
      condition: WeatherCondition.fromCode((current['weather_code'] as num).toInt()),
    );
  }
}

class WeatherReport {
  const WeatherReport({
    required this.placeLabel,
    required this.latitude,
    required this.longitude,
    required this.temperature,
    required this.humidity,
    required this.windSpeed,
    required this.windDirection,
    required this.observationTime,
    required this.condition,
  });

  final String placeLabel;
  final double latitude;
  final double longitude;
  final double temperature;
  final double? humidity;
  final double windSpeed;
  final double windDirection;
  final String observationTime;
  final WeatherCondition condition;
}

class WeatherCondition {
  const WeatherCondition(this.label, this.icon);

  final String label;
  final IconData icon;

  static WeatherCondition fromCode(int code) {
    if (code == 0) {
      return const WeatherCondition('Clear sky', Icons.wb_sunny_outlined);
    }
    if ([1, 2, 3].contains(code)) {
      return const WeatherCondition('Partly cloudy', Icons.cloud_outlined);
    }
    if ([45, 48].contains(code)) {
      return const WeatherCondition('Fog', Icons.foggy);
    }
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
      return const WeatherCondition('Rain showers', Icons.water_drop_outlined);
    }
    if (code >= 71 && code <= 77) {
      return const WeatherCondition('Snow', Icons.ac_unit);
    }
    if (code >= 95) {
      return const WeatherCondition('Thunderstorm', Icons.thunderstorm_outlined);
    }

    return const WeatherCondition('Mixed conditions', Icons.cloud_queue);
  }
}
