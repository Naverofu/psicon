package com.psicon.controller;

import com.psicon.model.Consulta;
import com.psicon.service.ConsultaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

// @RestController e @RequestMapping definem que todas as rotas aqui começam com /api/consultas
@RestController
@RequestMapping("/api/consultas")
@CrossOrigin(origins = "*")
public class ConsultaController {

    @Autowired
    private ConsultaService consultaService;

    // Rota: POST /api/consultas/agendar
    // Passamos os IDs na URL e a data no formato padrão ISO.
    // Exemplo: /api/consultas/agendar?idPaciente=1&idPsicologo=2&dataHora=2026-05-10T14:30:00
    @PostMapping("/agendar")
    public ResponseEntity<?> agendarNormal(
            @RequestParam Long idPaciente,
            @RequestParam Long idPsicologo,
            @RequestParam(required = false) Long idDependente, // required = false porque pode ser pro titular
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataHora) {

        try {
            Consulta novaConsulta = consultaService.agendarConsultaNormal(idPaciente, idPsicologo, idDependente, dataHora);
            return ResponseEntity.status(HttpStatus.CREATED).body(novaConsulta);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Rota: POST /api/consultas/emergencia
    // O paciente só clica no botão "Emergência" e manda o ID dele. O sistema faz o resto.
    @PostMapping("/emergencia")
    public ResponseEntity<?> acionarEmergencia(@RequestParam Long idPaciente) {
        try {
            Consulta consultaEmergencia = consultaService.agendarEmergencia(idPaciente);
            return ResponseEntity.status(HttpStatus.CREATED).body(consultaEmergencia);
        } catch (RuntimeException e) {
            // Se não tiver psicólogo online, retorna erro para o app mostrar o botão do CVV
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(e.getMessage());
        }
    }

    // Rota: GET /api/consultas/paciente/{idPaciente}
    // Lista a "Agenda" do paciente no app.
    @GetMapping("/paciente/{idPaciente}")
    public ResponseEntity<List<Consulta>> listarConsultasPaciente(@PathVariable Long idPaciente) {
        List<Consulta> consultas = consultaService.listarMinhasConsultasPaciente(idPaciente);
        return ResponseEntity.ok(consultas);
    }

    // Rota: GET /api/consultas/psicologo/{idPsicologo}
    // Lista a "Agenda" do psicólogo no app.
    @GetMapping("/psicologo/{idPsicologo}")
    public ResponseEntity<List<Consulta>> listarConsultasPsicologo(@PathVariable Long idPsicologo) {
        List<Consulta> consultas = consultaService.listarMinhasConsultasPsicologo(idPsicologo);
        return ResponseEntity.ok(consultas);
    }
}