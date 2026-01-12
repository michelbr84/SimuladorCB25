# Simulador CB25 - ToDo List

## Implemented Features

### Core Simulation Engine
- **Team Structure**: Team data model with attack, defense, and home advantage attributes
- **Match Simulation**: Match simulation logic with goal probability calculation
- **League Table**: Points calculation system (3 points for win, 1 for draw, 0 for loss)
- **Tie-breakers**: Goal difference and goals scored for ranking
- **Full League Schedule**: Complete round-robin tournament (38 rounds, 380 matches)

### Data Management
- **Team Database**: Pre-configured teams for Campeonato Brasileiro Série A
- **Match History**: Track all simulated matches with scores
- **Results Storage**: Persistent results across simulation runs

### User Interface
- **Visual League Table**: Formatted table showing position, team, points, matches played, wins, draws, losses, goals, goal difference
- **Match Results Display**: Show completed matches with scores
- **Simulation Controls**: Commands to run full season or individual rounds
- **Clear UI**: Well-organized output with headers and formatting

### Season Management
- **Current Round Tracking**: Track progress through 38 rounds
- **Round-by-Round Simulation**: Option to simulate specific rounds
- **Complete Season Simulation**: Run entire 380 matches at once

## Pending Tasks

### High Priority
- [ ] **Serialization/Deserialization**: Save simulation state to JSON file
- [ ] **Load Previous State**: Resume simulation from saved state
- [ ] **Statistical Analysis**: Team performance metrics over time
- [ ] **Real-time Updates**: Progress indicators during long simulations

### Medium Priority
- [ ] **Detailed Match Analysis**: Show goal scorers, match statistics
- [ ] **Head-to-Head Records**: Team vs team historical performance
- [ ] **Form Indicator**: Last 5 matches performance for each team
- [ ] **Top Scorers Table**: Track individual player goals (if player data added)
- [ ] **Simulation Export**: Export results to CSV/JSON for external analysis

### Low Priority
- [ ] **Custom Team Editing**: Allow user to modify team attributes
- [ ] **Multiple Leagues**: Support for other competitions
- [ ] **Season Simulation with Variance**: Different difficulty modes
- [ ] **Prediction Engine**: Win/draw/loss probability calculator
- [ ] **Interactive Web Interface**: HTML/React frontend
- [ ] **Historical Data Comparison**: Compare multiple seasons
- [ ] **Relegation Zone Analysis**: Track teams in danger zone
- [ ] **Title Race Visualization**: Show leading teams throughout season

### Nice to Have
- [ ] **Live Simulation Mode**: Watch matches unfold in real-time
- [ ] **Achievement System**: Milestones and records
- [ ] **Transfer Window**: Add/remove players from teams
- [ ] **Injury System**: Random injuries affecting team performance
- [ ] **Manager System**: Different managers affecting team attributes
- [ ] **Financial System**: Club budgets and transfers
- [ ] **Integration with Real Data**: Import real season results
- [ ] **Tournament Bracket**: For knockout stages if expanded

### Known Issues
- [ ] **Branch Coverage**: No tests verifying branch execution
- [ ] **Integration Tests**: End-to-end scenario testing
- [ ] **Edge Cases**: Handle extreme team attributes
- [ ] **Performance**: Optimization for large-scale simulations

## Project Statistics
- **Languages**: Python
- **Lines of Code**: TBD
- **Test Coverage**: TBD
- **Last Update**: 2024

## Notes
- Project focuses on Campeonato Brasileiro Série A format
- Simulation uses simplified statistical model
- All features are extensible for future enhancements
- Current priority is completing serialization and state management